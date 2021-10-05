const config = require('config')
const _ = require('lodash')
const errors = require('./errors')
const dbHelper = require('./db-helper')
const esHelper = require('./es-helper')
const helper = require('./helper')
const logger = require('./logger')

// mapping operation to topic
const OP_TO_TOPIC = {
  create: config.UBAHN_CREATE_TOPIC,
  patch: config.UBAHN_UPDATE_TOPIC,
  remove: config.UBAHN_DELETE_TOPIC
}

// Used for determining the payload structure when posting to bus api
const SUB_USER_DOCUMENTS = {}
const SUB_ORG_DOCUMENTS = {}
_.forOwn(config.ES.DOCUMENTS, (value, key) => {
  if (value.userField) {
    SUB_USER_DOCUMENTS[key] = value
  } else if (value.orgField) {
    SUB_ORG_DOCUMENTS[key] = value
  }
})

// map model name to bus message resource if different
const MODEL_TO_RESOURCE = {
  UsersSkill: 'userskill',
  AchievementsProvider: 'achievementprovider',
  UserAttribute: 'userattribute',
  UsersRole: 'userrole',
  OrganizationSkillsProvider: 'organizationskillprovider'
}

/**
 * Create record in es
 * @param resource the resource to create
 * @param result the resource fields
 */
async function createRecordInEs (resource, entity) {
  try {
    await esHelper.processCreate(resource, entity)
  } catch (err) {
    logger.logFullError(err)
    throw err
  }

  // publish create event.
  try {
    await publishMessage('create', resource, entity)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * Patch record in es
 * @param resource the resource to create
 * @param result the resource fields
 */
async function patchRecordInEs (resource, entity) {
  try {
    await esHelper.processUpdate(resource, entity)
  } catch (err) {
    logger.logFullError(err)
    throw err
  }

  // publish patch event.
  try {
    await publishMessage('patch', resource, entity)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * post delete message to es
 * @param id the id of record
 * @param params the params of record (like nested ids)
 * @param resource the resource to delete
 */
async function deleteRecordFromEs (id, params, resource) {
  let payload
  if (SUB_USER_DOCUMENTS[resource] || SUB_ORG_DOCUMENTS[resource]) {
    payload = _.assign({}, params)
  } else {
    payload = {
      id
    }
  }
  try {
    await esHelper.processDelete(resource, payload)
  } catch (err) {
    logger.logFullError(err)
    throw err
  }

  try {
    await publishMessage('remove', resource, payload)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * get resource in es
 * @param resource resource to get
 * @param id resource id
 * @param params resource params
 * @param auth resource auth
 */
async function getRecordInEs (resource, id, params, auth) {
  // Merge path and query params
  try {
    const result = await esHelper.getFromElasticSearch(resource, id, auth, params)
    // check permission
    helper.permissionCheck(auth, result)
    return result
  } catch (err) {
    // return error if enrich fails or permission fails
    if ((resource === 'user' && params.enrich) || (err.status && err.status === 403)) {
      throw errors.elasticSearchEnrichError(err.message)
    }
    logger.logFullError(err)
  }
}

/**
 * search resource in es
 * @param resource the resource to delete
 * @param query the search query
 * @param auth the auth object
 */
async function searchRecordInEs (resource, query, auth) {
  // remove dollar signs that are used for postgres
  for (const key of Object.keys(query)) {
    if (key[0] === '$' && key[key.length - 1] === '$') {
      query[key.slice(1, -1)] = query[key]
      delete query[key]
    }
  }

  try {
    return await esHelper.searchElasticSearch(resource, query, auth)
  } catch (err) {
    // return error if enrich fails
    if (resource === 'user' && query.enrich) {
      throw errors.elasticSearchEnrichError(err.message)
    }
    logger.logFullError(err)
  }
  return null
}

/**
 * Get the resource from model name
 * @param modelName the model name
 * @returns {string|*} the resource
 */
function getResource (modelName) {
  if (MODEL_TO_RESOURCE[modelName]) {
    return MODEL_TO_RESOURCE[modelName]
  } else {
    return modelName.toLowerCase()
  }
}

/**
 * Posts the message to bus api
 * @param {String} op The action
 * @param {String} resource The name of the resource
 * @param {Object} result The payload
 */
async function publishMessage (op, resource, result) {
  if (!OP_TO_TOPIC[op]) {
    logger.warn(`Invalid operation: ${op}`)
    return
  }

  const { postEvent } = require('./helper')

  logger.debug(`Publishing message to bus: resource ${resource}, data ${JSON.stringify(result, null, 2)}`)

  // Send Kafka message using bus api
  await postEvent(OP_TO_TOPIC[op], _.assign({ resource }, result))
}

/**
 * Sleep for some time
 * @param ms the time to sleep in ms
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * delete child of record with delay between each item deleted and with transaction
 * @param model the child model to delete
 * @param id the user id to delete
 * @param params the params for child
 * @param resourceName the es recource name
 * @param transaction the transaction object
 */
async function deleteChild (model, id, params, resourceName, transaction) {
  const query = {}
  query[params[0]] = id
  const result = await dbHelper.find(model, query)

  if (result && result.length > 0) {
    let index = 0
    while (index < result.length) {
      // initialize params
      const record = result[index]
      const esParams = {}
      params.forEach(attr => { esParams[attr] = record[attr] })

      // remove from db
      await dbHelper.remove(model, record.id, null, transaction)
      await deleteRecordFromEs(record.id, esParams, resourceName)

      // sleep for configured time
      await sleep(config.CASCADE_PAUSE_MS)
      index++
    }
  }
}

module.exports = {
  getResource,
  patchRecordInEs,
  deleteRecordFromEs,
  searchRecordInEs,
  createRecordInEs,
  getRecordInEs,
  deleteChild
}
