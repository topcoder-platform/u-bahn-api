/**
 * the users skill services
 */
const joi = require('@hapi/joi')
const config = require('config')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const User = sequelize.models.User
const UsersSkill = sequelize.models.UsersSkill
const resource = serviceHelper.getResource('UsersSkill')
const uniqueFields = [['userId', 'skillId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(User, entity.userId)
  await dbHelper.makeSureUnique(UsersSkill, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.create(UsersSkill, entity, auth, t)
      newEntity = result.toJSON()
      await serviceHelper.createRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'userskill.create')
    }
    throw e
  }
}

create.schema = {
  entity: {
    userId: joi.string().required(),
    skillId: joi.string().required(),
    metricValue: joi.string(),
    certifierId: joi.string(),
    certifiedDate: joi.date().format('iso')
  },
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
  if (entity.userId) {
    await dbHelper.get(User, entity.userId)
  }

  await dbHelper.makeSureUnique(UsersSkill, entity, uniqueFields, params)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.update(UsersSkill, id, entity, auth, params, t)
      newEntity = result.toJSON()
      await serviceHelper.patchRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'userskill.update')
    }
    throw e
  }
}

patch.schema = {
  id: joi.string(),
  entity: {
    userId: joi.string(),
    skillId: joi.string(),
    metricValue: joi.string(),
    certifierId: joi.string(),
    certifiedDate: joi.date()
  },
  auth: joi.object(),
  params: joi.object()
}

/**
 * get device by id
 * @param id the device id
 * @param auth the auth obj
 * @param params the path parameters
 * @param query the query parameters
 * @param fromDb Should we bypass Elasticsearch for the record and fetch from db instead?
 * @return {Promise} the db device
 */
async function get (id, auth, params, query = {}, fromDb = false) {
  const trueParams = _.assign(params, query)
  if (!fromDb) {
    const esResult = await serviceHelper.getRecordInEs(resource, id, trueParams, auth)
    if (esResult) {
      return esResult
    }
  }

  const recordObj = await dbHelper.get(UsersSkill, id, params)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${UsersSkill.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
  }

  helper.permissionCheck(auth, recordObj)
  return recordObj
}

/**
 * search devices by query
 * @param query the search query
 * @param auth the auth object
 * @return {Promise} the results
 */
async function search (query, auth) {
  // make sure id exists
  await dbHelper.get(User, query.userId)

  // get from elasticsearch, if that fails get from db
  // and response headers ('X-Total', 'X-Page', etc.) are not set in case of db return
  const esResult = await serviceHelper.searchRecordInEs(resource, query, auth)
  if (esResult) {
    return esResult
  }

  const items = await dbHelper.find(UsersSkill, query, auth)

  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    userId: joi.string().required()
  },
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
  const entity = { id }
  try {
    await sequelize.transaction(async (t) => {
      await dbHelper.remove(UsersSkill, id, params, t)
      await serviceHelper.deleteRecordFromEs(id, params, resource)
    })
  } catch (e) {
    helper.publishError(config.UBAHN_ERROR_TOPIC, entity, 'userskill.delete')
    throw e
  }
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
