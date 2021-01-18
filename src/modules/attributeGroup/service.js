/**
 * the attribute group services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const AttributeGroup = sequelize.models.AttributeGroup
const Organization = sequelize.models.Organization
const Attribute = sequelize.models.Attribute
const resource = serviceHelper.getResource('AttributeGroup')
const uniqueFields = [['name']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(Organization, entity.organizationId)
  await dbHelper.makeSureUnique(AttributeGroup, entity, uniqueFields)

  const result = await dbHelper.create(AttributeGroup, entity, auth)
  await serviceHelper.createRecordInEs(resource, result.dataValues)
  return result
}

create.schema = {
  entity: {
    name: joi.string().required(),
    organizationId: joi.string().required()
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
  await dbHelper.makeSureUnique(AttributeGroup, entity, uniqueFields)

  const newEntity = await dbHelper.update(AttributeGroup, id, entity, auth)
  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)
  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    name: joi.string(),
    organizationId: joi.string()
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

  const recordObj = await dbHelper.get(AttributeGroup, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${AttributeGroup.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  const items = await dbHelper.find(AttributeGroup, query, auth)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    name: joi.string(),
    organizationId: joi.string()
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
  const existing = await dbHelper.find(Attribute, { attributeGroupId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${Attribute.name} with ids ${existing.map(o => o.id)}`)
  }
  await dbHelper.remove(AttributeGroup, id)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
