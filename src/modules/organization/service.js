/**
 * the organizations services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const OrganizationSkillsProvider = sequelize.models.OrganizationSkillsProvider
const ExternalProfile = sequelize.models.ExternalProfile
const AttributeGroup = sequelize.models.AttributeGroup
const Organization = sequelize.models.Organization
const resource = serviceHelper.getResource('Organization')
const uniqueFields = [['name']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.makeSureUnique(Organization, entity, uniqueFields)
  const result = await dbHelper.create(Organization, entity, auth)
  await serviceHelper.createRecordInEs(resource, result)

  return result
}

create.schema = {
  entity: {
    name: joi.string().required()
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
  await dbHelper.makeSureUnique(Organization, entity, uniqueFields)
  const newEntity = await dbHelper.update(Organization, id, entity, auth)
  await serviceHelper.patchRecordInEs(resource, newEntity)

  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    name: joi.string()
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

  const recordObj = await dbHelper.get(Organization, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${Organization.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  const items = await dbHelper.find(Organization, query, auth)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    name: joi.string()
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
  let existing = await dbHelper.find(AttributeGroup, { organizationId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${AttributeGroup.name} with ids ${existing.map(o => o.id)}`)
  }
  existing = await dbHelper.find(ExternalProfile, { organizationId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${ExternalProfile.name} with ids ${existing.map(o => o.id)}`)
  }

  beginCascadeDelete(id, params)
}

/**
 * begin the cascade delete
 * @param {*} id the organization id to delete
 * @param {*} id the path params
 */
async function beginCascadeDelete (id, params) {
  await serviceHelper.deleteChild(OrganizationSkillsProvider, id, ['organizationId', 'skillProviderId'], 'OrganizationSkillsProvider')
  await dbHelper.remove(Organization, id)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
