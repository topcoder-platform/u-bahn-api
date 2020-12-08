/**
 * the skill services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const sequelize = require('../../models/index')

const Skill = sequelize.models.Skill
const SkillsProvider = sequelize.models.SkillsProvider
const UsersSkill = sequelize.models.UsersSkill
const resource = serviceHelper.getResource('Skill')
const uniqueFields = [['skillProviderId', 'externalId', 'name']]

/**
 * create entity
 * @param entity the request device entity
 * @param auth the auth information
 * @return {Promise} the created device
 */
async function create (entity, auth) {
  await dbHelper.get(SkillsProvider, entity.skillProviderId)
  await dbHelper.makeSureUnique(Skill, entity, uniqueFields)

  const result = await dbHelper.create(Skill, entity, auth)
  await serviceHelper.createRecordInEs(resource, result)

  return result
}

create.schema = {
  entity: {
    skillProviderId: joi.string().required(),
    name: joi.string().required(),
    uri: joi.string(),
    externalId: joi.string()
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
  if (entity.skillProviderId) {
    await dbHelper.get(SkillsProvider, entity.skillProviderId)
  }
  await dbHelper.makeSureUnique(Skill, entity, uniqueFields)

  const newEntity = await dbHelper.update(Skill, id, entity, auth)
  await serviceHelper.patchRecordInEs(resource, newEntity)

  return newEntity
}

patch.schema = {
  id: joi.string(),
  entity: {
    skillProviderId: joi.string(),
    name: joi.string(),
    uri: joi.string(),
    externalId: joi.string()
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

  const recordObj = await dbHelper.get(Skill, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${Skill.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
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

  const items = await dbHelper.find(Skill, query, auth)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.id(),
    perPage: joi.pageSize(),
    skillProviderId: joi.string(),
    name: joi.string(),
    externalId: joi.string()
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
  const existing = await dbHelper.find(UsersSkill, { skillId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${UsersSkill.name} with ids ${existing.map(o => o.id)}`)
  }
  await dbHelper.remove(Skill, id)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
