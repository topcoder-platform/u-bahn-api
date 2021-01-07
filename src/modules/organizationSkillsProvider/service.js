/**
 * the organization skills provider services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const SkillsProvider = sequelize.models.SkillsProvider
const Organization = sequelize.models.Organization
const OrganizationSkillsProvider = sequelize.models.OrganizationSkillsProvider
const resource = serviceHelper.getResource('OrganizationSkillsProvider')
const uniqueFields = [['organizationId', 'skillProviderId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(Organization, entity.organizationId)
  await dbHelper.get(SkillsProvider, entity.skillProviderId)
  await dbHelper.makeSureUnique(OrganizationSkillsProvider, entity, uniqueFields)

  const result = await dbHelper.create(OrganizationSkillsProvider, entity, auth)
  await serviceHelper.createRecordInEs(resource, result.dataValues)

  return result
}

create.schema = {
  entity: {
    organizationId: joi.string().required(),
    skillProviderId: joi.string().required()
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
  if (entity.organizationId) {
    await dbHelper.get(Organization, entity.organizationId)
  }
  if (entity.skillProviderId) {
    await dbHelper.get(SkillsProvider, entity.skillProviderId)
  }

  await dbHelper.makeSureUnique(OrganizationSkillsProvider, entity, uniqueFields, params)

  const newEntity = await dbHelper.update(OrganizationSkillsProvider, id, entity, auth, params)
  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)

  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    organizationId: joi.string(),
    skillProviderId: joi.string()
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

  const recordObj = await dbHelper.get(OrganizationSkillsProvider, id, params)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${OrganizationSkillsProvider.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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
  await dbHelper.get(Organization, query.organizationId)

  // get from elasticsearch, if that fails get from db
  // and response headers ('X-Total', 'X-Page', etc.) are not set in case of db return
  const esResult = await serviceHelper.searchRecordInEs(resource, query, auth)
  if (esResult) {
    return esResult
  }

  const items = await dbHelper.find(OrganizationSkillsProvider, query, auth)

  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    organizationId: joi.string().required()
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
  await dbHelper.remove(OrganizationSkillsProvider, id, params)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
