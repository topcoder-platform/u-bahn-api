/**
 * the attribute services
 */

const joi = require('@hapi/joi')
const config = require('config')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const Attribute = sequelize.models.Attribute
const AttributeGroup = sequelize.models.AttributeGroup
const UserAttribute = sequelize.models.UserAttribute
const resource = serviceHelper.getResource('Attribute')
const uniqueFields = [['name', 'attributeGroupId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(AttributeGroup, entity.attributeGroupId)
  await dbHelper.makeSureUnique(Attribute, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.create(Attribute, entity, auth, t)
      newEntity = result.toJSON()
      await serviceHelper.createRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'attribute.create')
    }
    throw e
  }
}

create.schema = {
  entity: {
    name: joi.string().required(),
    attributeGroupId: joi.string().required()
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
  if (entity.attributeGroupId) {
    await dbHelper.get(AttributeGroup, entity.attributeGroupId)
  }
  await dbHelper.makeSureUnique(Attribute, entity, uniqueFields)

  let newEntity
  try {
    await sequelize.transaction(async (t) => {
      const result = await dbHelper.update(Attribute, id, entity, auth, params, t)
      newEntity = result.toJSON()
      await serviceHelper.patchRecordInEs(resource, newEntity)
    })
    return newEntity
  } catch (e) {
    if (newEntity) {
      helper.publishError(config.UBAHN_ERROR_TOPIC, newEntity, 'attribute.update')
    }
    throw e
  }
}

patch.schema = {
  id: joi.string(),
  entity: {
    name: joi.string(),
    attributeGroupId: joi.string()
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

  const recordObj = await dbHelper.get(Attribute, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${Attribute.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  const items = await dbHelper.find(Attribute, query, auth)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    name: joi.string(),
    attributeGroupId: joi.string()
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
  const existing = await dbHelper.find(UserAttribute, { attributeId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${UserAttribute.name} with ids ${existing.map(o => o.id)}`)
  }

  const entity = { id }
  try {
    await sequelize.transaction(async (t) => {
      await dbHelper.remove(Attribute, id, params, t)
      await serviceHelper.deleteRecordFromEs(id, params, resource)
    })
  } catch (e) {
    helper.publishError(config.UBAHN_ERROR_TOPIC, entity, 'attribute.delete')
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
