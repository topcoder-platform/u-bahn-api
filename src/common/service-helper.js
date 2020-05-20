const joi = require('@hapi/joi')
const appConst = require('../consts')
const _ = require('lodash')
const errors = require('./errors')

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
   * @param params the query params
   * @return {Promise} the db device
   */
  async function get (id, auth, params) {
    let recordObj
    if (_.isNil(params) || _.isEmpty(params)) {
      recordObj = await models.DBHelper.get(Model, id)
    } else {
      const items = await models.DBHelper.find(Model, buildQueryByParams(params))
      recordObj = items[0]
      if (!recordObj) {
        throw errors.newEntityNotFoundError(`cannot find ${Model.tableName} where ${_.map(params, (v, k) => `${k}:${v}`).join(', ')}`)
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
    const dbQueries = await buildDBQuery(query, auth)

    // user token
    // for non-admin users, this endpoint will only return entities that the user has created.
    if (auth.roles && !checkIfExists(auth.roles, [appConst.UserRoles.admin])) {
      dbQueries.push(`${Model.tableName}.createdBy = '${getAuthUser(auth)}'`)
    }
    const items = await models.DBHelper.find(Model, dbQueries)
    return { items, meta: { total: items.length } }
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
    await get(id, auth, params) // check exist
    await models.DBHelper.delete(Model, id, buildQueryByParams(params))
  }

  return {
    create, search, patch, get, remove
  }
}

module.exports = {
  getServiceMethods
}
