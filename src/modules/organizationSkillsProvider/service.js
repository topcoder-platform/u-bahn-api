/**
 * the organization skills provider services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')
const models = require('../../models/index')
const helper = require('../../common/helper')
const serviceHelper = require('../../common/service-helper')
const logger = require('../../common/logger')
const errors = require('../../common/errors')
const appConst = require('../../consts')
const resource = serviceHelper.getResource(models.OrganizationSkillsProvider.name)

/**
 * create entity
 * @param entity the organizationskillprovider details
 * @param auth the auth information
 * @return {Promise} the created organizationSkillProvider
 */
async function create (entity, auth) {
  await serviceHelper.makeSureUnique(models.OrganizationSkillsProvider, entity, [['organizationId', 'skillProviderId']])
  await serviceHelper.makeSureRefExist(entity)

  const dbEntity = new models.OrganizationSkillsProvider()
  _.extend(dbEntity, entity)
  dbEntity.created = new Date()
  dbEntity.createdBy = helper.getAuthUser(auth)
  await models.DBHelper.save(models.OrganizationSkillsProvider, dbEntity)
  try {
    await serviceHelper.publishMessage('create', resource, dbEntity)
  } catch (err) {
    logger.logFullError(err)
  }
  return dbEntity
}

create.schema = {
  entity: {
    organizationId: joi.string().required(),
    skillProviderId: joi.string().required()
  },
  auth: joi.object()
}

/**
 * get organizationskillprovider by org and skill provider id(s)
 * @param organizationId the org id
 * @param skillProviderId the skill provider id
 * @param auth the auth obj
 * @return {Promise} the db organizationskillprovider
 */
async function get (organizationId, skillProviderId, auth) {
  const payload = { organizationId, skillProviderId }
  // TODO - First query ES
  // try {
  //   const result = await esHelper.getFromElasticSearch(resource, id, auth, trueParams)
  //   // check permission
  //   permissionCheck(auth, result)
  //   return result
  // } catch (err) {
  //   // return error if enrich fails or permission fails
  //   if (err.status && err.status === 403) {
  //     throw errors.elasticSearchEnrichError(err.message)
  //   }
  //   logger.logFullError(err)
  // }
  const items = await models.DBHelper.find(
    models.OrganizationSkillsProvider,
    serviceHelper.buildQueryByParams(payload)
  )
  const recordObj = items[0]
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${models.OrganizationSkillsProvider.tableName} where ${_.map(payload, (v, k) => `${k}:${v}`).join(', ')}`)
  }
  helper.permissionCheck(auth, recordObj)
  return recordObj
}

/**
 * search organizationskillproviders by query
 * @param query the search query
 * @param auth the auth object
 * @return {Promise} the results
 */
async function search (query, auth) {
  // TODO - First query ES
  // try {
  //   return await esHelper.searchElasticSearch(resource, query, auth)
  // } catch (err) {
  //   logger.logFullError(err)
  // }

  // Elasticsearch failed. Hit the database
  const dbQueries = [`organizationId = '${query.organizationId}'`]

  // user token
  // for non-admin users, this endpoint will only return entities that the user has created.
  if (auth.roles && !helper.checkIfExists(auth.roles, [appConst.UserRoles.admin, appConst.UserRoles.administrator])) {
    dbQueries.push(`${models.OrganizationSkillsProvider.tableName}.createdBy = '${helper.getAuthUser(auth)}'`)
  }
  const items = await models.DBHelper.find(models.OrganizationSkillsProvider, dbQueries)
  // return fromDB:true to indicate it is got from db,
  // and response headers ('X-Total', 'X-Page', etc.) are not set in this case
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    organizationId: joi.string().required()
  },
  auth: joi.object()
}

/**
 * remove entity by id
 * @param organizationId the org id
 * @param skillProviderId the skill provider id
 * @param auth the auth obj
 * @return {Promise<void>} no data returned
 */
async function remove (organizationId, skillProviderId, auth) {
  await get(organizationId, skillProviderId, auth) // check exist
  const payload = { organizationId, skillProviderId }
  await models.DBHelper.delete(models.OrganizationSkillsProvider, null, serviceHelper.buildQueryByParams(payload))

  try {
    await serviceHelper.publishMessage('remove', resource, { payload })
  } catch (err) {
    logger.logFullError(err)
  }
}

module.exports = {
  create, search, get, remove
}
