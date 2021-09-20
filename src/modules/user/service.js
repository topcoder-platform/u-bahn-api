/**
 * the users services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')
const config = require('config')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const User = sequelize.models.User
const Achievement = sequelize.models.Achievement
const ExternalProfile = sequelize.models.ExternalProfile
const UserAttribute = sequelize.models.UserAttribute
const UsersRole = sequelize.models.UsersRole
const UsersSkill = sequelize.models.UsersSkill

const resource = serviceHelper.getResource('User')
const uniqueFields = [['handle']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.makeSureUnique(User, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.create(User, entity, auth, t)
      newEntity = result.toJSON()
      await serviceHelper.createRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'user.create')
    }
    throw e
  }
}

create.schema = {
  entity: {
    handle: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required()
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
  await dbHelper.makeSureUnique(User, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.update(User, id, entity, auth, params, t)
      newEntity = result.toJSON()
      await serviceHelper.patchRecordInEs(resource, newEntity)
    })

    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'user.update')
    }
    throw e
  }
}

patch.schema = {
  id: joi.string(),
  entity: {
    handle: joi.string(),
    firstName: joi.string(),
    lastName: joi.string()
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

  const recordObj = await dbHelper.get(User, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${User.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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
  // get from elasticsearch, if that fails get from db
  // and response headers ('X-Total', 'X-Page', etc.) are not set in case of db return
  const esResult = await serviceHelper.searchRecordInEs(resource, query, auth)
  if (esResult) {
    return esResult
  }

  delete query.enrich
  // add query for associations
  const include = [
    {
      where: {},
      model: UsersRole,
      attributes: []
    }
  ]
  if (query.roleId) {
    include[0].where.roleId = query.roleId
    delete query.roleId
  }

  const items = await dbHelper.find(User, query, auth, include)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    handle: joi.string(),
    roleId: joi.string(),
    enrich: joi.boolean(),
    'externalProfile.externalId': joi.string(),
    'externalProfile.organizationId': joi.string()
  },
  auth: joi.object()
}

/**
 * remove entity by id
 * @param id the entity id
 * @param auth the auth object
 * @param params the path params
 * @return {Promise<void>} no data returned
 */
async function remove (id, auth, params) {
  await beginCascadeDelete(id, params)
}

/**
 * begin the cascade delete
 * @param {*} id the user id to delete
 * @param params the path params
 */
async function beginCascadeDelete (id, params) {
  const payload = { id }
  try {
    await sequelize.transaction(async (t) => {
      await serviceHelper.deleteChild(Achievement, id, ['userId', 'achievementsProviderId'], 'achievement', t)
      await serviceHelper.deleteChild(ExternalProfile, id, ['userId', 'organizationId'], 'externalprofile', t)
      await serviceHelper.deleteChild(UserAttribute, id, ['userId', 'attributeId'], 'userattribute', t)
      await serviceHelper.deleteChild(UsersRole, id, ['userId', 'roleId'], 'userrole', t)
      await serviceHelper.deleteChild(UsersSkill, id, ['userId', 'skillId'], 'userskill', t)
      await dbHelper.remove(User, id, null, t)
      await serviceHelper.deleteRecordFromEs(id, params, resource, true)
    })
  } catch (e) {
    helper.publishError(config.UBAHN_ERROR_TOPIC, payload, 'user.delete')
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
