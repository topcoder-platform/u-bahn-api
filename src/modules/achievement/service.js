/**
 * the achievement services
 */
const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const User = sequelize.models.User
const AchievementsProvider = sequelize.models.AchievementsProvider
const Achievement = sequelize.models.Achievement
const resource = serviceHelper.getResource('Achievement')
const uniqueFields = [['userId', 'achievementsProviderId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(User, entity.userId)
  await dbHelper.get(AchievementsProvider, entity.achievementsProviderId)

  await dbHelper.makeSureUnique(Achievement, entity, uniqueFields)

  const result = await dbHelper.create(Achievement, entity, auth)
  await serviceHelper.createRecordInEs(resource, result.dataValues)

  return result
}

create.schema = {
  entity: {
    userId: joi.string().required(),
    achievementsProviderId: joi.string().required(),
    name: joi.string().required(),
    uri: joi.string(),
    certifierId: joi.string().allow(''),
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
  await dbHelper.get(User, entity.userId)
  await dbHelper.get(AchievementsProvider, entity.achievementsProviderId)

  await dbHelper.makeSureUnique(Achievement, entity, uniqueFields, params)

  const newEntity = await dbHelper.update(Achievement, id, entity, auth, params)
  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)

  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    userId: joi.string().required(),
    achievementsProviderId: joi.string().required(),
    name: joi.string(),
    uri: joi.string(),
    certifierId: joi.string().allow(''),
    certifiedDate: joi.date().format('iso')
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

  const recordObj = await dbHelper.get(Achievement, id, params)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${Achievement.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  // add query for associations
  if (query.achievementsProviderName) {
    query['$AchievementsProvider.name$'] = query.achievementsProviderName
    delete query.achievementsProviderName
  }

  const items = await dbHelper.find(Achievement, query, auth, [{
    model: AchievementsProvider,
    as: 'AchievementsProvider',
    attributes: []
  }])

  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    userId: joi.string().required(),
    achievementsProviderName: joi.string()
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
  await dbHelper.remove(Achievement, id, params)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
