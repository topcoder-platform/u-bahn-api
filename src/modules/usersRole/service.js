/**
 * the user role services
 */

const joi = require('@hapi/joi')
const config = require('config')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const Role = sequelize.models.Role
const User = sequelize.models.User
const UsersRole = sequelize.models.UsersRole
const resource = serviceHelper.getResource('UsersRole')
const uniqueFields = [['userId', 'roleId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(Role, entity.roleId)
  await dbHelper.get(User, entity.userId)
  await dbHelper.makeSureUnique(UsersRole, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.create(UsersRole, entity, auth, t)
      newEntity = result.toJSON()
      await serviceHelper.createRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'userrole.create')
    }
    throw e
  }
}

create.schema = {
  entity: {
    userId: joi.string().required(),
    roleId: joi.string().required()
  },
  auth: joi.object()
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

  const recordObj = await dbHelper.get(UsersRole, id, params)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${UsersRole.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  // add query for associations
  const items = await dbHelper.find(UsersRole, query, auth)

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
      await dbHelper.remove(UsersRole, id, params, t)
      await serviceHelper.deleteRecordFromEs(id, params, resource)
    })
  } catch (e) {
    helper.publishError(config.UBAHN_ERROR_TOPIC, entity, 'userrole.delete')
    throw e
  }
}

module.exports = {
  create,
  search,
  get,
  remove
}
