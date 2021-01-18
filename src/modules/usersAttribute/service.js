/**
 * the user attribute services
 */
const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const AttributeGroup = sequelize.models.AttributeGroup
const Attribute = sequelize.models.Attribute
const User = sequelize.models.User
const UserAttribute = sequelize.models.UserAttribute
const resource = serviceHelper.getResource('UserAttribute')
const uniqueFields = [['userId', 'attributeId']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(Attribute, entity.attributeId)
  await dbHelper.get(User, entity.userId)
  await dbHelper.makeSureUnique(UserAttribute, entity, uniqueFields)

  const result = await dbHelper.create(UserAttribute, entity, auth)
  await serviceHelper.createRecordInEs(resource, result.dataValues)

  return result
}

create.schema = {
  entity: {
    userId: joi.string().required(),
    attributeId: joi.string().required(),
    value: joi.string().required()
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
  if (entity.attributeId) {
    await dbHelper.get(Attribute, entity.attributeId)
  }
  if (entity.userId) {
    await dbHelper.get(User, entity.userId)
  }

  await dbHelper.makeSureUnique(UserAttribute, entity, uniqueFields, params)

  const newEntity = await dbHelper.update(UserAttribute, id, entity, auth, params)
  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)

  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    userId: joi.string(),
    attributeId: joi.string(),
    value: joi.string()
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

  const recordObj = await dbHelper.get(UserAttribute, id, params)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${UserAttribute.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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
  if (query.attributeName) {
    query['$Attribute.name$'] = query.attributeName
    delete query.attributeName
  }
  if (query.attributeGroupName) {
    query['$Attribute.AttributeGroup.name$'] = query.attributeGroupName
    delete query.attributeGroupName
  }
  if (query.attributeGroupId) {
    query['$Attribute.AttributeGroup.id$'] = query.attributeGroupId
    delete query.attributeGroupId
  }
  const items = await dbHelper.find(UserAttribute, query, auth, [{
    model: Attribute,
    as: 'Attribute',
    attributes: [],
    include: [{
      model: AttributeGroup,
      as: 'AttributeGroup',
      attributes: []
    }]
  }])

  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    userId: joi.string().required(),
    attributeName: joi.string(),
    attributeGroupName: joi.string(),
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
  await dbHelper.remove(UserAttribute, id, params)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
