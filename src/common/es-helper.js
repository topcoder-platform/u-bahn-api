const config = require('config')
const _ = require('lodash')
const querystring = require('querystring')
const logger = require('../common/logger')
const helper = require('../common/helper')
const appConst = require('../consts')
const esClient = require('./es-client').getESClient()

const {
  TopResources,
  UserResources,
  OrganizationResources
} = appConst

const DOCUMENTS = config.ES.DOCUMENTS
const RESOURCES = Object.keys(DOCUMENTS)

const SUB_USER_DOCUMENTS = {}
const SUB_ORG_DOCUMENTS = {}
const SUB_USER_PROPERTIES = []
const SUB_ORG_PROPERTIES = []
_.forOwn(DOCUMENTS, (value, key) => {
  if (value.userField) {
    SUB_USER_DOCUMENTS[key] = value
    SUB_USER_PROPERTIES.push(value.userField)
  } else if (value.orgField) {
    SUB_ORG_DOCUMENTS[key] = value
    SUB_ORG_PROPERTIES.push(value.orgField)
  }
})

const USER_ATTRIBUTE = {
  esDocumentPath: 'attributes',
  esDocumentQuery: 'attributes.attributeId.keyword',
  esDocumentValueStringQuery: 'attributes.value',
  esDocumentValueQuery: 'attributes.value.keyword',
  esDocumentId: 'attributes.id'
}

const USER_ORGANIZATION = {
  esOrganizationQuery: 'externalProfiles.organizationId.keyword'
}

const USER_FILTER_TO_MODEL = {
  skill: {
    esDocumentQuery: 'skills.skillId.keyword'
  },
  achievement: {
    name: 'achievement',
    isAttribute: false,
    model: require('../models/Achievement'),
    queryField: 'name',
    esDocumentValueQuery: 'achievements.name',
    esDocumentQuery: 'achievements.id.keyword',
    esDocumentId: 'achievements.id',
    values: []
  },
  get achievements () { return this.achievement },
  location: {
    name: 'location',
    isAttribute: true,
    attributeName: 'location',
    esDocumentPath: USER_ATTRIBUTE.esDocumentPath,
    esDocumentQuery: USER_ATTRIBUTE.esDocumentQuery,
    esDocumentValueQuery: USER_ATTRIBUTE.esDocumentValueQuery,
    defaultSortOrder: 'asc',
    values: []
  },
  get locations () { return this.location },
  isavailable: {
    name: 'isAvailable',
    isAttribute: true,
    attributeName: 'isAvailable',
    esDocumentPath: USER_ATTRIBUTE.esDocumentPath,
    esDocumentQuery: USER_ATTRIBUTE.esDocumentQuery,
    esDocumentValueQuery: USER_ATTRIBUTE.esDocumentValueQuery,
    defaultSortOrder: 'desc', // results in ordering: true false
    values: []
  },
  company: {
    name: 'company',
    isAttribute: true,
    attributeName: 'company',
    esDocumentPath: USER_ATTRIBUTE.esDocumentPath,
    esDocumentQuery: USER_ATTRIBUTE.esDocumentQuery,
    esDocumentValueQuery: USER_ATTRIBUTE.esDocumentValueQuery,
    defaultSortOrder: 'asc',
    values: []
  }
}

// resource filter config
const RESOURCE_FILTER = {
  // independent resources
  user: {
    handle: {
      resource: 'user',
      queryField: 'handle'
    },
    roleId: {
      resource: 'userrole',
      queryField: 'roleId'
    }
  },
  role: {
    name: {
      resource: 'role',
      queryField: 'name'
    }
  },
  achievementprovider: {
    name: {
      resource: 'achievementprovider',
      queryField: 'name'
    }
  },
  organization: {
    name: {
      resource: 'organization',
      queryField: 'name'
    }
  },
  attribute: {
    name: {
      resource: 'attribute',
      queryField: 'name'
    },
    attributeGroupId: {
      resource: 'attribute',
      queryField: 'attributeGroupId'
    }
  },
  attributegroup: {
    name: {
      resource: 'attributegroup',
      queryField: 'name'
    },
    organizationId: {
      resource: 'attributegroup',
      queryField: 'organizationId'
    }
  },
  // sub-resources
  externalprofile: {
    organizationName: {
      resource: 'organization',
      queryField: 'name'
    },
    externalId: {
      resource: 'externalprofile',
      queryField: 'externalId'
    },
    isInactive: {
      resource: 'externalprofile',
      queryField: 'isInactive'
    }
  },
  achievement: {
    achievementsProviderName: {
      resource: 'achievementprovider',
      queryField: 'name'
    }
  },
  userattribute: {
    attributeName: {
      resource: 'attribute',
      queryField: 'name'
    },
    attributeGroupName: {
      resource: 'attributegroup',
      queryField: 'name'
    },
    attributeGroupId: {
      resource: 'attributegroup',
      queryField: 'id'
    }
  }
}

// filter chain config
const FILTER_CHAIN = {
  user: {
    idField: 'id'
  },
  attribute: {
    filterNext: 'userattribute',
    queryField: 'attributeId',
    idField: 'attributeGroupId'
  },
  attributegroup: {
    filterNext: 'attribute',
    queryField: 'attributeGroupId',
    idField: 'id'
  },
  role: {
    filterNext: 'userrole',
    queryField: 'roleId',
    idField: 'id'
  },
  achievementprovider: {
    filterNext: 'achievement',
    queryField: 'achievementsProviderId',
    idField: 'id'
  },
  organization: {
    filterNext: 'externalprofile',
    queryField: 'organizationId',
    idField: 'id'
  },
  // sub resource
  userskill: {
    queryField: 'skillId',
    idField: 'skillId'
  },
  userrole: {
    queryField: 'roleId',
    idField: 'roleId'
  },
  externalprofile: {
    idField: 'organizationId'
  },
  achievement: {
    idField: 'achievementsProviderId'
  },
  userattribute: {
    idField: 'attributeId'
  },
  organizationskillprovider: {
    queryField: 'skillProviderId',
    idField: 'skillProviderId'
  }
}

function getTotalCount (total) {
  return typeof total === 'number' ? total : total.value
}

function escapeRegex (str) {
  /* eslint-disable no-useless-escape */
  return str
    .replace(/[\*\+\-=~><\"\?^\${}\(\)\:\!\/[\]\\\s]/g, '\\$&') // replace single character special characters
    .replace(/\|\|/g, '\\||') // replace ||
    .replace(/\&\&/g, '\\&&') // replace &&
    .replace(/AND/g, '\\A\\N\\D') // replace AND
    .replace(/OR/g, '\\O\\R') // replace OR
    .replace(/NOT/g, '\\N\\O\\T') // replace NOT
  /* eslint-enable no-useless-escape */
}

/**
 * Function to get user from es
 * @param {String} userId
 * @returns {Object} user
 */
async function getUser (userId) {
  const { body: user } = await esClient.get({ index: TopResources.user.index, type: TopResources.user.type, id: userId })
  return { seqNo: user._seq_no, primaryTerm: user._primary_term, user: user._source }
}

/**
 * Function to update es user
 * @param {String} userId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {Object} body
 */
async function updateUser (userId, body, seqNo, primaryTerm) {
  try {
    await esClient.index({
      index: TopResources.user.index,
      type: TopResources.user.type,
      id: userId,
      body,
      if_seq_no: seqNo,
      if_primary_term: primaryTerm,
      pipeline: TopResources.user.ingest.pipeline.id,
      refresh: 'wait_for'
    })
    logger.debug('Update user completed')
  } catch (err) {
    if (err && err.meta && err.meta.body && err.meta.body.error) {
      logger.debug(JSON.stringify(err.meta.body.error, null, 4))
    }
    logger.debug(JSON.stringify(err))
    throw err
  }
}

/**
 * Function to get org from es
 * @param {String} organizationId
 * @returns {Object} organization
 */
async function getOrg (organizationId) {
  const { body: org } = await esClient.get({ index: TopResources.organization.index, type: TopResources.organization.type, id: organizationId })
  return { seqNo: org._seq_no, primaryTerm: org._primary_term, org: org._source }
}

/**
 * Function to update es organization
 * @param {String} organizationId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {Object} body
 */
async function updateOrg (organizationId, body, seqNo, primaryTerm) {
  await esClient.index({
    index: TopResources.organization.index,
    type: TopResources.organization.type,
    id: organizationId,
    body,
    if_seq_no: seqNo,
    if_primary_term: primaryTerm,
    refresh: 'wait_for'
  })
  await esClient.enrich.executePolicy({ name: TopResources.organization.enrich.policyName })
}

/**
 * Process create entity
 * @param {String} resource resource name
 * @param {Object} entity entity object
 */
async function processCreate (resource, entity) {
  if (_.includes(_.keys(TopResources), resource)) {
    // process the top resources such as user, attribute...
    helper.validProperties(entity, ['id'])
    await esClient.index({
      index: TopResources[resource].index,
      type: TopResources[resource].type,
      id: entity.id,
      body: _.omit(entity, ['resource', 'originalTopic']),
      pipeline: TopResources[resource].ingest ? TopResources[resource].ingest.pipeline.id : undefined,
      refresh: 'true'
    })
    if (TopResources[resource].enrich) {
      await esClient.enrich.executePolicy({
        name: TopResources[resource].enrich.policyName
      })
    }
  } else if (_.includes(_.keys(UserResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = UserResources[resource]
    userResource.validate(entity)
    const { seqNo, primaryTerm, user } = await getUser(entity.userId)
    const relateId = entity[userResource.relateKey]
    if (!user[userResource.propertyName]) {
      user[userResource.propertyName] = []
    }

    // import groups for a new user
    if (resource === 'externalprofile' && entity.externalId) {
      const userGroups = await helper.getUserGroup(entity.externalId)
      user[config.get('ES.USER_GROUP_PROPERTY_NAME')] = _.unionBy(user[config.get('ES.USER_GROUP_PROPERTY_NAME')], userGroups, 'id')
    }

    // check the resource does not exist
    if (_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`Can't create existed ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${entity.userId}`)
      throw helper.getErrorWithStatus('[version_conflict_engine_exception]', 409)
    } else {
      user[userResource.propertyName].push(entity)
      await updateUser(entity.userId, user, seqNo, primaryTerm)
    }
  } else if (_.includes(_.keys(OrganizationResources), resource)) {
    // process org resources such as org skill provider
    const orgResources = OrganizationResources[resource]
    orgResources.validate(entity)
    const { seqNo, primaryTerm, org } = await getOrg(entity.organizationId)
    const relateId = entity[orgResources.relateKey]
    if (!org[orgResources.propertyName]) {
      org[orgResources.propertyName] = []
    }

    // check the resource does not exist
    if (_.some(org[orgResources.propertyName], [orgResources.relateKey, relateId])) {
      logger.error(`Can't create existing ${resource} with the ${orgResources.relateKey}: ${relateId}, organizationId: ${entity.organizationId}`)
      throw helper.getErrorWithStatus('[version_conflict_engine_exception]', 409)
    } else {
      org[orgResources.propertyName].push(entity)
      await updateOrg(entity.organizationId, org, seqNo, primaryTerm)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.values(TopResources), _.keys(UserResources), _.keys(OrganizationResources))}]`)
  }
}

/**
 * Process update entity
 * @param {String} resource resource name
 * @param {Object} entity entity object
 */
async function processUpdate (resource, entity) {
  if (_.includes(_.keys(TopResources), resource)) {
    logger.info(`Processing top level resource: ${resource}`)
    // process the top resources such as user, skill...
    helper.validProperties(entity, ['id'])
    const { index, type } = TopResources[resource]
    const id = entity.id
    const { body: source } = await esClient.get({ index, type, id })
    await esClient.index({
      index,
      type,
      id,
      body: _.assign(source._source, _.omit(entity, ['resource', 'originalTopic'])),
      pipeline: TopResources[resource].ingest ? TopResources[resource].ingest.pipeline.id : undefined,
      if_seq_no: source._seq_no,
      if_primary_term: source._primary_term,
      refresh: 'true'
    })
    if (TopResources[resource].enrich) {
      await esClient.enrich.executePolicy({
        name: TopResources[resource].enrich.policyName
      })
    }
  } else if (_.includes(_.keys(UserResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = UserResources[resource]
    const relateId = entity[userResource.relateKey]
    logger.info(`Processing user level resource: ${resource}:${relateId}`)
    userResource.validate(entity)
    logger.info(`Resource validated for ${relateId}`)
    const { seqNo, primaryTerm, user } = await getUser(entity.userId)
    logger.info(`User fetched ${user.id} and ${relateId}`)

    // check the resource exist
    if (!user[userResource.propertyName] || !_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${entity.userId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      const updateIndex = _.findIndex(user[userResource.propertyName], [userResource.relateKey, relateId])
      user[userResource.propertyName].splice(updateIndex, 1, entity)
      logger.info(`Updating ${user.id} and ${relateId}`)
      await updateUser(entity.userId, user, seqNo, primaryTerm)
      logger.info(`Updated ${user.id} and ${relateId}`)
    }
  } else if (_.includes(_.keys(OrganizationResources), resource)) {
    logger.info(`Processing org level resource: ${resource}`)
    // process org resources such as org skill providers
    const orgResource = OrganizationResources[resource]
    orgResource.validate(entity)
    const { seqNo, primaryTerm, org } = await getOrg(entity.organizationId)
    const relateId = entity[orgResource.relateKey]

    // check the resource exist
    if (!org[orgResource.propertyName] || !_.some(org[orgResource.propertyName], [orgResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${orgResource.relateKey}: ${relateId}, organizationId: ${entity.organizationId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      const updateIndex = _.findIndex(org[orgResource.propertyName], [orgResource.relateKey, relateId])
      org[orgResource.propertyName].splice(updateIndex, 1, entity)
      await updateOrg(entity.organizationId, org, seqNo, primaryTerm)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.values(TopResources), _.keys(UserResources), _.keys(OrganizationResources))}]`)
  }
}

/**
 * Process delete entity
 * @param {String} resource resource name
 * @param {Object} entity entity object
 */
async function processDelete (resource, entity) {
  if (_.includes(_.keys(TopResources), resource)) {
    // process the top resources such as user, attribute...
    helper.validProperties(entity, ['id'])
    await esClient.delete({
      index: TopResources[resource].index,
      type: TopResources[resource].type,
      id: entity.id,
      refresh: 'wait_for'
    })
    if (TopResources[resource].enrich) {
      await esClient.enrich.executePolicy({
        name: TopResources[resource].enrich.policyName
      })
    }
  } else if (_.includes(_.keys(UserResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = UserResources[resource]
    userResource.validate(entity)
    const { seqNo, primaryTerm, user } = await getUser(entity.userId)
    const relateId = entity[userResource.relateKey]

    // check the resource exist
    if (!user[userResource.propertyName] || !_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${entity.userId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      _.remove(user[userResource.propertyName], [userResource.relateKey, relateId])
      await updateUser(entity.userId, user, seqNo, primaryTerm)
    }
  } else if (_.includes(_.keys(OrganizationResources), resource)) {
    // process user resources such as org skill provider
    const orgResource = OrganizationResources[resource]
    orgResource.validate(entity)
    const { seqNo, primaryTerm, org } = await getOrg(entity.organizationId)
    const relateId = entity[orgResource.relateKey]

    // check the resource exist
    if (!org[orgResource.propertyName] || !_.some(org[orgResource.propertyName], [orgResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${orgResource.relateKey}: ${relateId}, organizationId: ${entity.organizationId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      _.remove(org[orgResource.propertyName], [orgResource.relateKey, relateId])
      await updateOrg(entity.organizationId, org, seqNo, primaryTerm)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.keys(TopResources), _.keys(UserResources), _.keys(OrganizationResources))}]`)
  }
}

async function getOrganizationId (handle) {
  const dBHelper = require('../common/db-helper')
  const sequelize = require('../models/index')

  const orgIdLookupResults = await dBHelper.find(
    sequelize.models.ExternalProfile,
    {
      '$User.handle$': handle
    },
    [{
      model: sequelize.models.User,
      as: 'User',
      attributes: []
    }]
  )

  if (orgIdLookupResults.length > 0) {
    throw new Error(`Handle ${handle} is associated with multiple organizations. Cannot select one.`)
  } else if (orgIdLookupResults.length === 1) {
    return orgIdLookupResults[0].organizationId
  }

  throw new Error('User doesn\'t belong to any organization')
}

async function getAttributeId (organizationId, attributeName) {
  const dBHelper = require('../common/db-helper')
  const sequelize = require('../models/index')

  const attributeIdLookupResults = await dBHelper.find(
    sequelize.models.Attribute,
    {
      name: attributeName
    },
    [{
      model: sequelize.models.AttributeGroup,
      as: 'AttributeGroup',
      attributes: [],
      where: {
        organizationId
      },
      required: true
    }]
  )

  if (attributeIdLookupResults.length > 0) {
    return attributeIdLookupResults[0].id
  }

  throw new Error(`Attribute ${attributeName} is invalid for the current users organization`)
}

function parseUserFilter (params) {
  const filters = {}
  _.forOwn(params, (value, key) => {
    key = key.toLowerCase()
    if (USER_FILTER_TO_MODEL[key]) {
      if (!filters[key]) {
        filters[key] = _.clone(USER_FILTER_TO_MODEL[key])
      }

      filters[key].values = _.isString(value) ? [value] : value
    }
  })

  return filters
}

/**
 * Parse the query parameters to resource filters for enrich.
 * @param params the request query parameters
 * resources which are not in user index.
 * @returns {{}} the resource filters keyed by resource
 */
function parseEnrichFilter (params) {
  const filters = {}
  _.forOwn(params, (value, key) => {
    if (key.includes('.')) {
      const tokens = key.split('.')
      const resource = tokens[0].toLowerCase()
      // only valid resource filter
      if (RESOURCES.indexOf(resource)) {
        const doc = DOCUMENTS[resource]
        if (!filters[resource]) {
          filters[resource] = []
        }
        filters[resource].push({
          resource,
          // the property to apply a filter
          queryField: tokens[1],
          // the property in user index if resource is top-level
          userField: doc.userField,
          // the value to match
          value: value
        })
      }
    }
  })
  return filters
}

/**
 * Get a resource by Id from ES.
 * @param resource the resource to get
 * @param args the request path and query parameters
 * @returns {Promise<*>} the promise of retrieved resource object from ES
 */
async function getFromElasticSearch (resource, ...args) {
  logger.debug(`Get from ES first: args ${JSON.stringify(args, null, 2)}`)
  const id = args[0]
  // path and query parameters
  const params = args[2]

  const doc = DOCUMENTS[resource]
  const userDoc = DOCUMENTS.user
  const orgDoc = DOCUMENTS.organization
  const subUserDoc = SUB_USER_DOCUMENTS[resource]
  const subOrgDoc = SUB_ORG_DOCUMENTS[resource]
  const filterChain = FILTER_CHAIN[resource]

  let esQuery

  // construct ES query
  if (doc.userField) {
    esQuery = {
      index: userDoc.index,
      type: userDoc.type,
      id: params.userId
    }
  } else if (doc.orgField) {
    esQuery = {
      index: orgDoc.index,
      type: orgDoc.type,
      id: params.organizationId
    }
  } else {
    esQuery = {
      index: doc.index,
      type: doc.type,
      id: id
    }
  }

  if (resource === 'user') {
    // handle enrich
    if (!params.enrich) {
      esQuery._source_excludes = SUB_USER_PROPERTIES.join(',')
    }
  } else if (subUserDoc) {
    esQuery._source_includes = subUserDoc.userField
  } else if (subOrgDoc) {
    esQuery._source_includes = subOrgDoc.orgField
  }

  logger.debug(`ES query for get ${resource}: ${JSON.stringify(esQuery, null, 2)}`)

  // query ES
  const { body: result } = await esClient.getSource(esQuery)

  if (subUserDoc) {
    // find top sub doc by sub.id
    const found = result[subUserDoc.userField].find(sub => sub[filterChain.idField] === params[filterChain.idField])
    if (found) {
      return found
    } else {
      throw new Error(`${resource} of userId ${params.userId}, ${params[filterChain.idField]} is not found from ES`)
    }
  } else if (subOrgDoc) {
    // find top sub doc by sub.id
    const found = result[subOrgDoc.orgField].find(sub => sub[filterChain.idField] === params[filterChain.idField])
    if (found) {
      return found
    } else {
      throw new Error(`${resource} of organizationId ${params.organizationId}, ${params[filterChain.idField]} is not found from ES`)
    }
  }
  return result
}

/**
 * Parse the query parameters to resource filter list.
 * @param resource the resource to apply filter
 * @param params the request query parameter
 * @param itself true mean the filter is applied the resource itself
 * @returns {[]} parsed filter array
 */
function parseResourceFilter (resource, params, itself) {
  const resDefinedFilters = RESOURCE_FILTER[resource]
  const resFilters = []
  if (resDefinedFilters) {
    const resQueryParams = _.pick(params, Object.keys(resDefinedFilters))
    if (!_.isEmpty(resQueryParams)) {
      // filter by child resource
      _.forOwn(resQueryParams, (value, query) => {
        const filterDef = resDefinedFilters[query]
        if (itself && resource === filterDef.resource) {
          resFilters.push({
            param: query,
            resource: filterDef.resource,
            queryField: filterDef.queryField,
            value
          })
        } else if (!itself && resource !== filterDef.resource) {
          resFilters.push({
            param: query,
            resource: filterDef.resource,
            queryField: filterDef.queryField,
            value
          })
        }
      })
    }
  }
  return resFilters
}

/**
 * Set the filters to ES query.
 * @param resFilters the resource filters
 * @param esQuery the ES query
 */
function setResourceFilterToEsQuery (resFilters, esQuery) {
  if (resFilters.length > 0) {
    for (const filter of resFilters) {
      const doc = DOCUMENTS[filter.resource]
      let matchField
      if (doc.userField) {
        matchField = `${doc.userField}.${filter.queryField}`
      } else if (doc.orgField) {
        matchField = `${doc.orgField}.${filter.queryField}`
      } else {
        matchField = `${filter.queryField}`
      }
      if (filter.queryField !== 'name' && filter.queryField !== 'isInactive') {
        matchField = matchField + '.keyword'
      }
      esQuery.body.query.bool.must.push({
        match: {
          [matchField]: filter.value
        }
      })
    }
  }
}

/**
 * Set filter values to ES query.
 * @param esQuery the ES query object
 * @param matchField the field to match
 * @param filterValue the filter value, it can be array or single value
 * @param queryField the field that the filter applies
 * @returns {*} the ES query
 */
function setFilterValueToEsQuery (esQuery, matchField, filterValue, queryField) {
  if (queryField !== 'name' && queryField !== 'isInactive') {
    matchField = matchField + '.keyword'
  }
  if (Array.isArray(filterValue)) {
    for (const value of filterValue) {
      esQuery.body.query.bool.should.push({
        match: {
          [matchField]: value
        }
      })
    }
    esQuery.body.query.bool.minimum_should_match = 1
  } else {
    esQuery.body.query.bool.must.push({
      match: {
        [matchField]: filterValue
      }
    })
  }
  return esQuery
}

/**
 * Set attribute filters to an ES query to filter users by attributes
 *
 * @param filterClause the filter clause of the ES query
 * @param attributes array of attribute id and value objects
 */
function setUserAttributesFiltersToEsQuery (filterClause, attributes) {
  for (const attribute of attributes) {
    if (typeof attribute.value !== 'object') {
      attribute.value = [attribute.value]
    }

    filterClause.push({
      nested: {
        path: USER_ATTRIBUTE.esDocumentPath,
        query: {
          bool: {
            filter: [{
              term: {
                [USER_ATTRIBUTE.esDocumentQuery]: attribute.id
              }
            }],
            should: attribute.value.map(val => {
              return {
                query_string: {
                  default_field: `${[USER_ATTRIBUTE.esDocumentValueQuery]}`,
                  query: `*${val.replace(/  +/g, ' ').split(' ').map(p => escapeRegex(p)).join('* AND *')}*`
                }
              }
            }),
            minimum_should_match: 1
          }
        }
      }
    })
  }
}

function setUserOrganizationFiilterToEsQuery (filterClause, organizationId) {
  filterClause.push({
    term: {
      [USER_ORGANIZATION.esOrganizationQuery]: organizationId
    }
  })
}

function hasNonAlphaNumeric (text) {
  const regex = /^[A-Za-z0-9 ]+$/
  return !regex.test(text)
}

async function setUserSearchClausesToEsQuery (boolClause, keyword) {
  const skillIds = (await helper.getSkillsByName(keyword)).map(skill => skill.id)
  boolClause.should.push({
    query_string: {
      fields: ['firstName', 'lastName', 'handle'],
      query: `\\*${escapeRegex(keyword.replace(/  +/g, ' ')).split(' ').join('\\* OR \\*')}\\*`
    }
  })

  keyword = escapeRegex(keyword)
  boolClause.should.push({
    nested: {
      path: USER_ATTRIBUTE.esDocumentPath,
      query: {
        query_string: {
          query: hasNonAlphaNumeric(keyword) ? `\\*${keyword}\\*` : `*${keyword}*`,
          fields: [USER_ATTRIBUTE.esDocumentValueStringQuery]
        }
      }
    }
  }, {
    query_string: {
      query: hasNonAlphaNumeric(keyword) ? `\\*${keyword}\\*` : `*${keyword}*`,
      fields: [USER_FILTER_TO_MODEL.achievement.esDocumentValueQuery]
    }
  })

  if (skillIds.length > 0) {
    boolClause.should.push({
      terms: {
        [USER_FILTER_TO_MODEL.skill.esDocumentQuery]: skillIds
      }
    })
  }

  boolClause.minimum_should_match = 1
}

/**
 * Build ES query from given filter.
 * @param filter
 * @returns {{}} created ES query object
 */
function buildEsQueryFromFilter (filter) {
  const queryDoc = DOCUMENTS[filter.resource]
  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      query: {
        bool: {
          must: [],
          should: [],
          minimum_should_match: 0
        }
      }
    }
  }

  const matchField = `${filter.queryField}`
  return setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
}

/**
  * Returns if char is one of the reserved regex characters
  * @param {*} char the char to check
  */
function isRegexReserved (char) {
  const reserved = '^$#@&<>~.?+*|{}[]()"\\'
  return reserved.indexOf(char) !== -1
}

function buildEsQueryToGetAchievements (organizationId, keyword, size) {
  const queryDoc = DOCUMENTS.user

  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      size: 0,
      query: {
        bool: {
          filter: []
        }
      },
      aggs: {
        achievements: {
          terms: {
            field: `${USER_FILTER_TO_MODEL.achievement.esDocumentValueQuery}.keyword`,
            include: `.*${keyword.replace(/[^a-zA-Z]/g, c => `[${!isRegexReserved(c) ? c : '\\' + c}]`).replace(/[A-Za-z]/g, c => `[${c.toLowerCase()}${c.toUpperCase()}]`)}.*`,
            size: size || 1000
          },
          aggs: {
            ids: {
              top_hits: {
                _source: [USER_FILTER_TO_MODEL.achievement.esDocumentId, USER_FILTER_TO_MODEL.achievement.esDocumentValueQuery]
              }
            }
          }
        }
      }
    }
  }

  setUserOrganizationFiilterToEsQuery(esQuery.body.query.bool.filter, organizationId)

  return esQuery
}

/**
 * Build ES Query to get attribute values by attributeId
 * @param attributeId the attribute whose values to fetch
 * @param attributeValue only fetch values that are case insensitive substrings of attributeValue
 * @param size the number of attributes to fetch
 * @return {{}} created ES query object
 */
function buildEsQueryToGetAttributeValues (attributeId, attributeValue, size) {
  const queryDoc = DOCUMENTS.user

  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      size: 0,
      aggs: {
        attributes: {
          nested: {
            path: USER_ATTRIBUTE.esDocumentPath
          },
          aggs: {
            ids: {
              terms: {
                field: USER_ATTRIBUTE.esDocumentQuery,
                include: attributeId
              },
              aggs: {
                values: {
                  terms: {
                    field: USER_ATTRIBUTE.esDocumentValueQuery,
                    include: `.*${attributeValue.replace(/[^a-zA-Z]/g, c => `[${!isRegexReserved(c) ? c : '\\' + c}]`).replace(/[A-Za-z]/g, c => `[${c.toLowerCase()}${c.toUpperCase()}]`)}.*`,
                    order: {
                      _key: 'asc'
                    },
                    size: size || 1000
                  },
                  aggs: {
                    attribute: {
                      top_hits: {
                        size: 1,
                        _source: USER_ATTRIBUTE.esDocumentId
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return esQuery
}

async function resolveUserFilterFromDb (filter, { handle }, organizationId) {
  const DBHelper = require('../common/db-helper')
  if (filter.isAttribute) {
    const esQueryClause = {
      bool: {
        filter: [],
        should: [],
        minimum_should_match: 0
      }
    }

    if (organizationId == null) {
      organizationId = await getOrganizationId(handle)
    }

    const attributeId = await getAttributeId(organizationId, filter.attributeName)

    esQueryClause.bool.filter.push({
      term: {
        [filter.esDocumentQuery]: attributeId
      }
    })

    if (typeof filter.values !== 'object') {
      filter.values = [filter.values]
    }

    for (const value of filter.values) {
      if (value === 'true' || value === 'false') {
        esQueryClause.bool.should.push({
          term: {
            [filter.esDocumentValueQuery]: value
          }
        })
      } else {
        esQueryClause.bool.should.push({
          query_string: {
            default_field: `${filter.esDocumentValueQuery}`,
            query: `*${value.replace(/  +/g, ' ').split(' ').join('* AND *')}*`
          }
        })
      }
    }

    esQueryClause.bool.minimum_should_match = 1

    return {
      nested: {
        path: filter.esDocumentPath,
        query: esQueryClause
      }
    }
  } else {
    const esQueryClause = {
      bool: {
        should: [],
        minimum_should_match: 0
      }
    }

    const model = filter.model

    let filterValuesQuery = `${filter.queryField} like '%${filter.values[0]}%'`
    const nFilterValues = filter.values.length
    for (let i = 1; i < nFilterValues; i++) {
      filterValuesQuery = `${filterValuesQuery} OR ${filter.queryField} like '%${filter.values[i]}%'`
    }

    // TODO Use the service method instead of raw query
    const dbQueries = [
      filterValuesQuery
    ]

    const results = await DBHelper.find(model, dbQueries)
    if (results.length > 0) {
      for (const { id } of results) {
        esQueryClause.bool.should.push({
          term: {
            [filter.esDocumentQuery]: id
          }
        })
      }
      esQueryClause.bool.minimum_should_match = 1
      return esQueryClause
    } else {
      throw new Error(`Lookup data of type ${filter.name} with one or more value(s) in (${filter.values.join(', ')}) does not exist. Cannot filter records using it as reference`)
    }
  }
}

async function resolveSortClauseFromDb (orderBy, { handle }, organizationId) {
  if (orderBy === 'name') {
    return [{
      'firstName.keyword': 'asc'
    }, {
      'lastName.keyword': 'asc'
    }]
  }

  const attributes = _.filter(USER_FILTER_TO_MODEL, d => d.isAttribute)
  for (const attribute of attributes) {
    if (orderBy === attribute.name) {
      if (organizationId == null) organizationId = await getOrganizationId(handle)

      return [{
        [attribute.esDocumentValueQuery]: {
          order: attribute.defaultSortOrder || 'asc',
          nested: {
            path: attribute.esDocumentPath,
            filter: {
              term: {
                [`${attribute.esDocumentQuery}`]: await getAttributeId(organizationId, attribute.attributeName)
              }
            }
          }
        }
      }]
    }
  }

  throw new Error(`Invalid orderBy clause encountered ${orderBy}.`)
}

/**
 * Resolve filter by querying ES with filter data.
 * @param filter the filter to query ES
 * @param initialRes the resource that initial request comes in
 * @returns {Promise<*>} the resolved value
 */
async function resolveResFilter (filter, initialRes) {
  const doc = DOCUMENTS[filter.resource]
  const filterChain = FILTER_CHAIN[filter.resource]

  // return the value if this is end of the filter
  if (filter.resource === initialRes || !filterChain.filterNext) {
    if (doc.orgField) {
      return {
        resource: filter.resource,
        orgField: doc.orgField,
        queryField: filter.queryField,
        value: filter.value
      }
    } else {
      return {
        resource: filter.resource,
        userField: doc.userField,
        queryField: filter.queryField,
        value: filter.value
      }
    }
  }

  // query ES with filter
  const esQuery = buildEsQueryFromFilter(filter)
  const { body: result } = await esClient.search(esQuery)

  const numHits = getTotalCount(result.hits.total)

  if (numHits > 0) {
    // this value can be array
    let value
    if (numHits === 1) {
      value = result.hits.hits[0]._source.id
    } else {
      value = result.hits.hits.map(hit => hit._source.id)
    }
    const nextFilter = {
      resource: filterChain.filterNext,
      queryField: filterChain.queryField,
      value
    }
    // go to next filter
    const resolved = await resolveResFilter(nextFilter, initialRes)
    return resolved
  }
  throw new Error(`Resource filter[${filter.resource}.${filter.queryField}=${filter.value}] query returns no data`)
}

/**
 * Filter sub-resource results by query filters.
 * @param results the ES query results from user index
 * @param preResFilterResults the resolved filter results that applied related resources
 * @param ownResFilters the filters that will be applied to the sub-resource that is requested
 * @param perPage
 * @returns {*}
 */
function applySubResFilters (results, preResFilterResults, ownResFilters, perPage) {
  let count = 0
  const filtered = _.filter(results, item => {
    for (const filter of preResFilterResults) {
      if (item[filter.queryField] !== filter.value) {
        return false
      }
    }
    for (const filter of ownResFilters) {
      if (item[filter.queryField] !== filter.value) {
        return false
      }
    }
    count += 1
    if (count > perPage) {
      return false
    }
    return true
  })
  return filtered
}

/**
 * Search ES with provided request parameters.
 * @param resource the resource to search
 * @param args the request path and query parameters
 * @returns {Promise<*>} the promise of searched results
 */
async function searchElasticSearch (resource, ...args) {
  const {
    checkIfExists,
    getAuthUser
  } = require('./helper')
  logger.debug(`Searching ES first with query args: ${JSON.stringify(args[0], null, 2)}`)
  // path and query parameters
  const params = args[0]
  const authUser = args[1]
  const doc = DOCUMENTS[resource]
  const userDoc = DOCUMENTS.user
  const orgDoc = DOCUMENTS.organization
  const topUserSubDoc = SUB_USER_DOCUMENTS[resource]
  const topOrgSubDoc = SUB_ORG_DOCUMENTS[resource]
  if (!params.page) {
    params.page = 1
  }
  if (!params.perPage) {
    params.perPage = config.PAGE_SIZE
  }

  let sortClause = []

  const preResFilters = parseResourceFilter(resource, params, false)
  const preResFilterResults = []
  // resolve pre resource filters
  if (!params.enrich && preResFilters.length > 0) {
    for (const filter of preResFilters) {
      const resolved = await resolveResFilter(filter, resource)
      preResFilterResults.push(resolved)
    }
  }

  // resolve pre-enrich filters except sub-resource filter
  const enrichFilters = parseEnrichFilter(params)
  const enrichFilterResults = []
  if (params.enrich && resource === 'user') {
    for (const res of Object.keys(enrichFilters)) {
      const enFilters = enrichFilters[res]
      // filter the non sub-resource
      for (const filter of enFilters) {
        if (!filter.userField) {
          const resolved = await resolveResFilter(filter)
          enrichFilterResults.push(resolved)
        }
      }
    }
  }

  const userFilters = params.enrich && resource === 'user' ? parseUserFilter(params) : []
  const resolvedUserFilters = []
  if (params.enrich && resource === 'user') {
    const filterKey = Object.keys(userFilters)
    const authUserOrganizationId = params.organizationId
    for (const key of filterKey) {
      const resolved = await resolveUserFilterFromDb(userFilters[key], authUser, authUserOrganizationId)
      resolvedUserFilters.push(resolved)
    }

    if (params.orderBy) {
      sortClause = sortClause.concat(await resolveSortClauseFromDb(params.orderBy, authUser, authUserOrganizationId))
    }
  } else if (params.orderBy) {
    sortClause = [{ [`${params.orderBy}.keyword`]: 'asc' }]
  }

  // construct ES query
  const esQuery = {
    index: doc.userField ? userDoc.index : (doc.orgField ? orgDoc.index : doc.index),
    type: doc.userField ? userDoc.type : (doc.orgField ? orgDoc.type : doc.type),
    size: params.perPage,
    from: (params.page - 1) * params.perPage, // Es Index starts from 0
    body: {
      query: {
        bool: {
          must: [],
          should: [],
          minimum_should_match: 0
        }
      },
      sort: sortClause
    }
  }

  // for non-admin, only return entities that the user created
  if (
    authUser.roles &&
    !checkIfExists(authUser.roles, appConst.AdminUser) &&
    !checkIfExists(authUser.roles, [appConst.UserRoles.ubahn])
  ) {
    setFilterValueToEsQuery(esQuery, 'createdBy', getAuthUser(authUser), 'createdBy')
  }

  if (resource === 'user') {
    if (params.enrich) {
      // apply user filters
      if (resolvedUserFilters.length > 0) {
        esQuery.body.query.bool.filter = resolvedUserFilters
      }

      // apply resolved pre-enrich filter values
      if (enrichFilterResults.length > 0) {
        for (const filter of enrichFilterResults) {
          const matchField = `${filter.userField}.${filter.queryField}`
          setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
        }
      }
      // set the sub-resource filters which is in user index
      _.forOwn(enrichFilters, (enFilter, resource) => {
        _.forEach(enFilter, filter => {
          if (filter.userField) {
            let matchField = `${filter.userField}.${filter.queryField}`
            if (filter.queryField !== 'name') {
              matchField = matchField + '.keyword'
            }
            esQuery.body.query.bool.must.push({
              match: {
                [matchField]: filter.value
              }
            })
          }
        })
      })
    } else {
      // do not return sub-resources
      esQuery._source_excludes = SUB_USER_PROPERTIES.join(',')
    }
  } else if (topUserSubDoc) {
    // add userId match
    const userFC = FILTER_CHAIN.user
    const userIdMatchField = `${userFC.idField}.keyword`
    esQuery.body.query.bool.must.push({
      match: {
        [userIdMatchField]: params.userId
      }
    })
    esQuery._source_includes = topUserSubDoc.userField
  } else if (topOrgSubDoc) {
    // add organizationId match
    const orgFC = FILTER_CHAIN.organization
    const orgIdMatchField = `${orgFC.idField}.keyword`
    esQuery.body.query.bool.must.push({
      match: {
        [orgIdMatchField]: params.organizationId
      }
    })
    esQuery._source_includes = topOrgSubDoc.orgField
  }

  // set pre res filter results
  if (!params.enrich && preResFilterResults.length > 0) {
    for (const filter of preResFilterResults) {
      let matchField
      if (filter.userField) {
        matchField = `${filter.userField}.${filter.queryField}`
      } else if (filter.orgField) {
        matchField = `${filter.orgField}.${filter.queryField}`
      } else {
        matchField = `${filter.queryField}`
      }
      setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
    }
  }

  const ownResFilters = parseResourceFilter(resource, params, true)
  // set it's own res filter to the main query
  if (!params.enrich && ownResFilters.length > 0) {
    setResourceFilterToEsQuery(ownResFilters, esQuery)
  }

  logger.debug(`ES query for search ${resource}: ${JSON.stringify(esQuery, null, 2)}`)
  const { body: docs } = await esClient.search(esQuery)
  if (docs.hits && getTotalCount(docs.hits.total) === 0) {
    return {
      total: docs.hits.total,
      page: params.page,
      perPage: params.perPage,
      result: []
    }
  }

  let result = []
  if (topUserSubDoc) {
    result = docs.hits.hits[0]._source[topUserSubDoc.userField]
    // for sub-resource query, it returns all sub-resource items in one user,
    // so needs filtering and also page size
    result = applySubResFilters(result, preResFilterResults, ownResFilters, params.perPage)
  } else if (topOrgSubDoc) {
    result = docs.hits.hits[0]._source[topOrgSubDoc.orgField]
    // for sub-resource query, it returns all sub-resource items in one organization,
    // so needs filtering and also page size
    result = applySubResFilters(result, preResFilterResults, ownResFilters, params.perPage)
  } else {
    result = docs.hits.hits.map(hit => hit._source)
  }

  return {
    total: docs.hits.total,
    page: params.page,
    perPage: params.perPage,
    result
  }
}

/**
 * Searches for users. Returns enriched user information
 * Difference between this as GET /users is that the latter uses query params to filter data
 * and has different set of filters to query with.
 * @param {Object} authUser The auth object
 * @param {Object} filter The details of the search
 * @param {Object} params The query params
 */
async function searchUsers (authUser, filter, params) {
  const { checkIfExists, getAuthUser } = require('./helper')
  const queryDoc = DOCUMENTS.user

  if (!filter.organizationId) {
    throw new Error('Cannot search for users without organization info')
  }

  if (!params.page) {
    params.page = 1
  }
  if (!params.perPage) {
    params.perPage = config.PAGE_SIZE
  }

  let sortClause = []

  const userFilters = parseUserFilter(filter)
  const resolvedUserFilters = []

  const authUserOrganizationId = filter.organizationId
  const filterKey = Object.keys(userFilters)

  for (const key of filterKey) {
    const resolved = await resolveUserFilterFromDb(userFilters[key], authUser, authUserOrganizationId)
    resolvedUserFilters.push(resolved)
  }

  if (params.orderBy) {
    sortClause = sortClause.concat(await resolveSortClauseFromDb(params.orderBy, authUser, authUserOrganizationId))
  }

  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    size: params.perPage,
    from: (params.page - 1) * params.perPage,
    body: {
      query: {
        bool: {
          must: [],
          should: [],
          filter: [],
          minimum_should_match: 0
        }
      },
      sort: sortClause
    }
  }

  // for non-admin, only return entities that the user created
  if (
    authUser.roles &&
    !checkIfExists(authUser.roles, appConst.AdminUser) &&
    !checkIfExists(authUser.roles, [appConst.UserRoles.ubahn])
  ) {
    setFilterValueToEsQuery(esQuery, 'createdBy', getAuthUser(authUser), 'createdBy')
  }

  if (resolvedUserFilters.length > 0) {
    esQuery.body.query.bool.filter = resolvedUserFilters
  }

  if (filter.keyword != null) {
    await setUserSearchClausesToEsQuery(esQuery.body.query.bool, filter.keyword)
  }

  if (filter.attributes != null) {
    setUserAttributesFiltersToEsQuery(esQuery.body.query.bool.filter, filter.attributes)
  }

  if (filter.organizationId != null) {
    setUserOrganizationFiilterToEsQuery(esQuery.body.query.bool.filter, filter.organizationId)
  }

  // We never return inactive users
  esQuery.body.query.bool.filter.push({
    term: {
      'externalProfiles.isInactive': false
    }
  })

  logger.debug(`ES query for searching users: ${JSON.stringify(esQuery, null, 2)}`)
  const { body: docs } = await esClient.search(esQuery)
  const result = docs.hits.hits.map(hit => hit._source)

  return {
    total: getTotalCount(docs.hits.total),
    page: params.page,
    perPage: params.perPage,
    result
  }
}

/**
 * Searches for matching values for the given attribute value, under the given attribute id
 * @param {Object} param0 The attribute id and the attribute value properties
 */
async function searchAttributeValues ({ attributeId, attributeValue }) {
  const esQuery = buildEsQueryToGetAttributeValues(attributeId, querystring.unescape(attributeValue), 5)
  logger.debug(`ES query for searching attribute values: ${JSON.stringify(esQuery, null, 2)}`)

  const { body: esResult } = await esClient.search(esQuery)
  logger.debug(`ES Result: ${JSON.stringify(esResult, null, 2)}`)
  const result = []
  const attributes = esResult.aggregations.attributes.ids.buckets

  for (const attribute of attributes) {
    const id = attribute.key
    const values = attribute.values.buckets

    for (const value of values) {
      result.push({
        attributeId: id,
        value: value.key,
        id: value.attribute.hits.hits[0]._source.id
      })
    }
  }

  return { result }
}

async function searchAchievementValues ({ organizationId, keyword }) {
  if (!organizationId) {
    throw Error('Cannot search for achievements without organization info')
  }
  const esQuery = buildEsQueryToGetAchievements(organizationId, querystring.unescape(keyword), 5)
  logger.debug(`ES query for searching achievement values; ${JSON.stringify(esQuery, null, 2)}`)

  const { body: esResult } = await esClient.search(esQuery)
  logger.debug(`ES response ${JSON.stringify(esResult, null, 2)}`)
  const result = esResult.aggregations.achievements.buckets.map(a => {
    const achievementName = a.key
    let achievementId = null

    for (const achievement of a.ids.hits.hits[0]._source.achievements) {
      if (achievement.name === achievementName) {
        achievementId = achievement.id
        break
      }
    }
    return {
      id: achievementId,
      name: achievementName
    }
  })

  return {
    result
  }
}

module.exports = {
  processCreate,
  processUpdate,
  processDelete,
  searchElasticSearch,
  getFromElasticSearch,
  searchUsers,
  searchAttributeValues,
  searchAchievementValues
}
