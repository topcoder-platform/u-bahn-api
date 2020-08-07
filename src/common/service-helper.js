const joi = require('@hapi/joi')
const config = require('config')
const appConst = require('../consts')
const _ = require('lodash')
const errors = require('./errors')
const esHelper = require('./es-helper')
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
  SkillsProvider: 'skillprovider',
  AchievementsProvider: 'achievementprovider',
  UsersAttribute: 'userattribute',
  UsersRole: 'userrole',
  OrganizationSkillsProvider: 'organizationskillprovider'
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
 * make sure reference item exists
 * @param entity the request entity
 */
async function makeSureRefExist (entity) {
  const models = require('../models/index')
  const modelMap = {
    skillProviderId: models.SkillsProvider,
    roleId: models.Role,
    userId: models.User,
    organizationId: models.Organization,
    achievementsProviderId: models.AchievementsProvider,
    attributeGroupId: models.AttributeGroup,
    attributeId: models.Attribute

  }
  const keys = Object.keys(entity)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (modelMap[key]) {
      await models.DBHelper.get(modelMap[key], entity[key], ['id'])
    }
  }
}

/**
 * make sure unique
 * @param model the db model
 * @param entity the entity
 * @param uniqueFields the uniqueFields
 */
async function makeSureUnique (model, entity, uniqueFields) {
  if (_.isNil(uniqueFields) || _.isEmpty(uniqueFields)) {
    return
  }
  const models = require('../models/index')
  for (let i = 0; i < uniqueFields.length; i++) {
    const params = {}
    _.each(uniqueFields[i], f => {
      if (entity[f]) {
        params[f] = entity[f]
      }
    })
    const items = await models.DBHelper.find(model, buildQueryByParams(params))
    if (items.length <= 0) {
      continue
    }

    if ((items.length > 0 && !entity.id) ||
      (items[0].id !== entity.id)
    ) {
      throw errors.newConflictError(`${model.tableName} already exists with ${_.map(params, (v, k) => `${k}:${v}`).join(', ')}`)
    }
  }
}

/**
 * build db query by params
 * @param params
 * @return {[]}
 */
function buildQueryByParams (params) {
  const dbQueries = []
  _.each(params, (v, k) => {
    dbQueries.push(`${k} = '${v}'`)
  })
  return dbQueries
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
 * get service methods
 * @param Model the model
 * @param createSchema the create joi schema
 * @param patchSchema the patch joi schema
 * @param searchSchema the search joi schema
 * @param buildDBQuery the async build db query function
 * @param uniqueFields the unique fields
 * @return {any} methods
 */
function getServiceMethods (Model, createSchema, patchSchema, searchSchema, buildDBQuery, uniqueFields) {
  const models = require('../models/index')
  const resource = getResource(Model.name)
  const { permissionCheck, checkIfExists, getAuthUser } = require('./helper')

  /**
   * create entity
   * @param entity the request device entity
   * @param auth the auth information
   * @return {Promise} the created device
   */
  async function create (entity, auth) {
    await makeSureUnique(Model, entity, uniqueFields)
    await makeSureRefExist(entity)

    const dbEntity = new Model()
    _.extend(dbEntity, entity)
    dbEntity.created = new Date()
    dbEntity.createdBy = getAuthUser(auth)
    await models.DBHelper.save(Model, dbEntity)
    try {
      await publishMessage('create', resource, dbEntity)
    } catch (err) {
      logger.logFullError(err)
    }
    return dbEntity
  }

  create.schema = {
    entity: createSchema,
    auth: joi.object()
  }

  /**
   * patch device by id
   * @param id the device id
   * @param entity the request device entity
   * @param auth the auth object
   * @param params the query params
   * @return {Promise} the updated device
   */
  async function patch (id, entity, auth, params) {
    await makeSureRefExist(entity)

    const dbEntity = await get(id, auth, params)
    const newEntity = new Model()
    _.extend(newEntity, dbEntity, entity)
    newEntity.updated = new Date()
    newEntity.updatedBy = getAuthUser(auth)
    await makeSureUnique(Model, newEntity, uniqueFields)
    await models.DBHelper.save(Model, newEntity)
    try {
      await publishMessage('patch', resource, newEntity)
    } catch (err) {
      logger.logFullError(err)
    }
    return newEntity
  }

  patch.schema = {
    id: joi.string(),
    entity: patchSchema,
    auth: joi.object(),
    params: joi.object()
  }

  /**
   * get device by id
   * @param id the device id
   * @param auth the auth obj
   * @param params the path parameters
   * @param query the query parameters
   * @return {Promise} the db device
   */
  async function get (id, auth, params, query = {}) {
    let recordObj
    // Merge path and query params
    const trueParams = _.assign(params, query)
    try {
      const result = await esHelper.getFromElasticSearch(resource, id, auth, trueParams)
      // check permission
      permissionCheck(auth, result)
      return result
    } catch (err) {
      // return error if enrich fails or permission fails
      if ((resource === 'user' && trueParams.enrich) || (err.status && err.status === 403)) {
        throw errors.elasticSearchEnrichError(err.message)
      }
      logger.logFullError(err)
    }
    if (_.isNil(trueParams) || _.isEmpty(trueParams)) {
      recordObj = await models.DBHelper.get(Model, id)
    } else {
      const items = await models.DBHelper.find(Model, buildQueryByParams(trueParams))
      recordObj = items[0]
      if (!recordObj) {
        throw errors.newEntityNotFoundError(`cannot find ${Model.tableName} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
      }
    }
    permissionCheck(auth, recordObj)
    return recordObj
  }

  /**
   * search devices by query
   * @param query the search query
   * @param auth the auth object
   * @return {Promise} the results
   */
  async function search (query, auth) {
    try {
      return await esHelper.searchElasticSearch(resource, query, auth)
    } catch (err) {
      // return error if enrich fails
      if (resource === 'user' && query.enrich) {
        throw errors.elasticSearchEnrichError(err.message)
      }
      logger.logFullError(err)
    }

    // Elasticsearch failed. Hit the database
    const dbQueries = await buildDBQuery(query, auth)

    // user token
    // for non-admin users, this endpoint will only return entities that the user has created.
    if (
      auth.roles &&
      !checkIfExists(auth.roles, appConst.AdminUser) &&
      !checkIfExists(auth.roles, [appConst.UserRoles.ubahn])
    ) {
      dbQueries.push(`${Model.tableName}.createdBy = '${getAuthUser(auth)}'`)
    }
    const items = await models.DBHelper.find(Model, dbQueries)
    // return fromDB:true to indicate it is got from db,
    // and response headers ('X-Total', 'X-Page', etc.) are not set in this case
    return { fromDb: true, result: items, total: items.length }
  }

  search.schema = {
    query: searchSchema,
    auth: joi.object()
  }

  /**
   * remove entity by id
   * @param id the entity id
   * @param auth the auth object
   * @param params the query params
   * @return {Promise<void>} no data returned
   */
  async function remove (id, auth, params) {
    let payload
    await get(id, auth, params) // check exist
    await models.DBHelper.delete(Model, id, buildQueryByParams(params))
    if (SUB_USER_DOCUMENTS[resource] || SUB_ORG_DOCUMENTS[resource]) {
      payload = _.assign({}, params)
    } else {
      payload = {
        id
      }
    }
    try {
      await publishMessage('remove', resource, payload)
    } catch (err) {
      logger.logFullError(err)
    }
  }

  return {
    create, search, patch, get, remove
  }
}

module.exports = {
  getServiceMethods
}
