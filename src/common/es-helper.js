const config = require('config')
const _ = require('lodash')
const logger = require('../common/logger')
const errors = require('./errors')
const groupApi = require('./group-api')
const appConst = require('../consts')
const esClient = require('./es-client').getESClient()

const DOCUMENTS = config.ES.DOCUMENTS
const RESOURCES = Object.keys(DOCUMENTS)

const SUB_DOCUMENTS = {}
const SUB_PROPERTIES = []
_.forOwn(DOCUMENTS, (value, key) => {
  if (value.userField) {
    SUB_DOCUMENTS[key] = value
    SUB_PROPERTIES.push(value.userField)
  }
})

// mapping operation to topic
const OP_TO_TOPIC = {
  create: config.UBAHN_CREATE_TOPIC,
  patch: config.UBAHN_UPDATE_TOPIC,
  remove: config.UBAHN_DELETE_TOPIC
}

// map model name to bus message resource if different
const MODEL_TO_RESOURCE = {
  UsersSkill: 'userskill',
  SkillsProvider: 'skillprovider',
  AchievementsProvider: 'achievementprovider',
  UsersAttribute: 'userattribute',
  UsersRole: 'userrole'
}

const USER_ATTRIBUTE = {
  esDocumentPath: 'attributes',
  esDocumentQuery: 'attributes.attributeId.keyword',
  esDocumentValueStringQuery: 'attributes.value',
  esDocumentValueQuery: 'attributes.value.keyword'
}

const USER_FILTER_TO_MODEL = {
  skill: {
    name: 'skill',
    isAttribute: false,
    model: require('../models/Skill'),
    queryField: 'name',
    esDocumentQuery: 'skills.skillId.keyword',
    values: []
  },
  get skills () { return this.skill },
  achievement: {
    name: 'achievement',
    isAttribute: false,
    model: require('../models/Achievement'),
    queryField: 'name',
    esDocumentValueQuery: 'achievements.name',
    esDocumentQuery: 'achievements.id.keyword',
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
    // TODO usergroup/group resource is not implemented yet
    // groupId: {
    //   resource: 'usergroup',
    //   queryField: 'groupId'
    // }
  },
  role: {
    name: {
      resource: 'role',
      queryField: 'name'
    }
  },
  skill: {
    externalId: {
      resource: 'skill',
      queryField: 'externalId'
    },
    skillProviderId: {
      resource: 'skill',
      queryField: 'skillProviderId'
    }
  },
  skillprovider: {
    name: {
      resource: 'skillprovider',
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
  userskill: {
    skillName: {
      resource: 'skill',
      queryField: 'name'
    }
  },
  externalprofile: {
    organizationName: {
      resource: 'organization',
      queryField: 'name'
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

// filter chaim config
const FILTER_CHAIN = {
  user: {
    idField: 'id'
  },
  skillprovider: {
    filterNext: 'skill',
    queryField: 'skillProviderId',
    idField: 'id'
  },
  skill: {
    filterNext: 'userskill',
    queryField: 'skillId',
    enrichNext: 'skillprovider',
    idField: 'skillProviderId'
  },
  attribute: {
    filterNext: 'userattribute',
    queryField: 'attributeId',
    enrichNext: 'attributegroup',
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
    queryFielid: 'skillId',
    enrichNext: 'skill',
    idField: 'skillId'
  },
  userrole: {
    queryField: 'roleId',
    enrichNext: 'role',
    idField: 'roleId'
  },
  externalprofile: {
    enrichNext: 'organization',
    idField: 'organizationId'
  },
  achievement: {
    enrichNext: 'achievementprovider',
    idField: 'achievementsProviderId'
  },
  userattribute: {
    enrichNext: 'attribute',
    idField: 'attributeId'
  }
}

/**
 * Get the resource from model name
 * @param modelName the model name
 * @returns {string|*} the resource
 */
function getResource (modelName) {
  if (MODEL_TO_RESOURCE[modelName]) {
    return MODEL_TO_RESOURCE[modelName]
  } else {
    return modelName.toLowerCase()
  }
}

function getTotalCount (total) {
  return typeof total === 'number' ? total : total.value
}

async function getOrganizationId (handle) {
  const DBHelper = require('../models/index').DBHelper

  // TODO Use the service method instead of raw query
  const orgIdLookupResults = await DBHelper.find(require('../models/ExternalProfile'), [
    'select * from DUser, ExternalProfile',
    `DUser.handle='${handle}'`,
    'DUser.id = ExternalProfile.userId'
  ])

  if (orgIdLookupResults.length > 0) {
    return orgIdLookupResults[0].organizationId
  }

  throw new Error('User doesn\'t belong to any organization')
}

async function getAttributeId (organizationId, attributeName) {
  const DBHelper = require('../models/index').DBHelper

  // TODO Use the service method instead of raw query
  const attributeIdLookupResults = await DBHelper.find(require('../models/Attribute'), [
    'select Attribute.id from AttributeGroup, Attribute',
    `AttributeGroup.organizationId = '${organizationId}'`,
    'Attribute.attributeGroupId = AttributeGroup.id',
    `Attribute.name = '${attributeName}'`
  ])

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
 * Enrich a resource recursively by following enrich path.
 * @param resource the resource to enrich
 * @param enrichIdProp the id property of child resource in parent object
 * @param item the parent object
 * @returns {Promise<void>} the promise of enriched parent object
 */
async function enrichResource (resource, enrichIdProp, item) {
  const subDoc = DOCUMENTS[resource]
  const filterChain = FILTER_CHAIN[resource]
  const subResult = await esClient.getSource({ index: subDoc.index, type: subDoc.type, id: item[enrichIdProp] })

  if (filterChain.enrichNext) {
    const enrichIdProp = filterChain.idField
    // return error if any id is missing in enrich path
    if (!subResult[enrichIdProp]) {
      throw new Error(`The parent ${resource} is missing id value of child resource ${filterChain.enrichNext}`)
    }
    // enrich next child resource recursively
    await enrichResource(filterChain.enrichNext, enrichIdProp, subResult)
  }
  item[resource] = subResult
}

/**
 * Enrich a user.
 * @param user the user object to enrich
 * @returns {Promise<*>} the promise of enriched user
 */
async function enrichUser (user) {
  for (const subProp of Object.keys(SUB_DOCUMENTS)) {
    const subDoc = SUB_DOCUMENTS[subProp]
    const subData = user[subDoc.userField]
    const filterChain = FILTER_CHAIN[subProp]
    if (subData && subData.length > 0) {
      // enrich next level sub resources
      for (const subItem of subData) {
        await enrichResource(filterChain.enrichNext, filterChain.idField, subItem)
      }
    }
  }
  return user
}

/**
 * Enrich users.
 * @param users list of users from ES search
 * @returns {Promise<*>} the enriched users
 */
async function enrichUsers (users) {
  const enrichedUsers = []
  for (const user of users) {
    const enriched = await enrichUser(user)
    enrichedUsers.push(enriched)
  }
  return enrichedUsers
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
  const subDoc = SUB_DOCUMENTS[resource]
  const filterChain = FILTER_CHAIN[resource]

  // construct ES query
  const esQuery = {
    index: doc.userField ? userDoc.index : doc.index,
    type: doc.userField ? userDoc.type : doc.type,
    id: doc.userField ? params.userId : id
  }

  if (resource === 'user') {
    // handle enrich
    if (!params.enrich) {
      esQuery._source_excludes = SUB_PROPERTIES.join(',')
    }
  } else if (subDoc) {
    esQuery._source_includes = subDoc.userField
  }

  logger.debug(`ES query for get ${resource}: ${JSON.stringify(esQuery, null, 2)}`)

  // query ES
  const result = await esClient.getSource(esQuery)

  if (params.enrich && resource === 'user') {
    const user = await enrichUser(result)
    const groups = await groupApi.getGroups(user.id)
    user.groups = groups
    return user
  } else if (subDoc) {
    // find top sub doc by sub.id
    const found = result[subDoc.userField].find(sub => sub[filterChain.idField] === params[filterChain.idField])
    if (found) {
      return found
    } else {
      throw new Error(`${resource} of userId ${params.userId}, ${params[filterChain.idField]} is not found from ES`)
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
  // TODO only current res filter
  if (resFilters.length > 0) {
    for (const filter of resFilters) {
      const doc = DOCUMENTS[filter.resource]
      let matchField = doc.userField ? `${doc.userField}.${doc.queryField}` : `${filter.queryField}`
      if (filter.queryField !== 'name') {
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
  if (queryField !== 'name') {
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
            filter: [
              {
                term: {
                  [USER_ATTRIBUTE.esDocumentQuery]: attribute.id
                }
              }
            ],
            should: attribute.value.map(val => {
              return {
                query_string: {
                  default_field: `${[USER_ATTRIBUTE.esDocumentValueStringQuery]}`,
                  query: `*${val.replace(/  +/g, ' ').split(' ').join('* AND *')}*`
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

/**
 * Get skillIds matching the search keyword
 *
 * @param keyword the search keyword
 * @returns array of skillIds
 */
async function searchSkills (keyword) {
  const queryDoc = DOCUMENTS.skill
  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      query: {
        query_string: {
          default_field: 'name',
          query: `*${keyword}*`
        }
      },
      _source: 'id'
    }
  }

  logger.debug(`ES query for searching skills: ${JSON.stringify(esQuery, null, 2)}`)
  const results = await esClient.search(esQuery)
  return results.hits.hits.map(hit => hit._source.id)
}

async function setUserSearchClausesToEsQuery (boolClause, keyword) {
  const skillIds = await searchSkills(keyword)

  boolClause.should.push({
    query_string: {
      fields: ['firstName', 'lastName', 'handle'],
      query: `*${keyword.replace(/  +/g, ' ').split(' ').join('* AND *')}*`
    }
  })

  boolClause.should.push({
    nested: {
      path: USER_ATTRIBUTE.esDocumentPath,
      query: {
        query_string: {
          query: `*${keyword}*`,
          fields: [USER_ATTRIBUTE.esDocumentValueStringQuery]
        }
      }
    }
  }, {
    query_string: {
      query: `*${keyword}*`,
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
 * Build ES Query to get attribute values by attributeId
 * @param attributeId the attribute whose values to fetch
 * @param attributeValue only fetch values that are case insensitive substrings of attributeValue
 * @param page result page, defaults to 1
 * @param perPage maximum number of matches to return, defaults to 5
 * @return {{}} created ES query object
 */
function buildEsQueryToGetAttributeValues (attributeId, attributeValue, page = 1, perPage = config.PAGE_SIZE) {
  const queryDoc = DOCUMENTS.user

  const matchConditions = [{
    match: {
      [USER_ATTRIBUTE.esDocumentQuery]: attributeId
    }
  }]

  if (attributeValue !== null) {
    matchConditions.push({
      query_string: {
        default_field: USER_ATTRIBUTE.esDocumentValueStringQuery,
        // minimum_should_match: `100%`, /* disallow misspellings */
        query: `*${attributeValue}*`
      }
    })
  }

  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      query: {
        nested: {
          path: USER_ATTRIBUTE.esDocumentPath,
          query: {
            bool: {
              must: matchConditions
            }
          },
          inner_hits: {} // Get the attriute values
        }
      },
      sort: [{
        [USER_ATTRIBUTE.esDocumentValueQuery]: {
          order: 'asc',
          nested: {
            path: USER_ATTRIBUTE.esDocumentPath,
            filter: {
              term: {
                [USER_ATTRIBUTE.esDocumentQuery]: attributeId
              }
            }
          }
        }
      }],
      size: perPage,
      from: (page - 1) * perPage,
      _source: {
        excludes: '*' // Parent document matches aren't required
      }
    }
  }

  return esQuery
}

async function resolveUserFilterFromDb (filter, { handle }, organizationId) {
  const DBHelper = require('../models/index').DBHelper

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
              term: { [`${attribute.esDocumentQuery}`]: await getAttributeId(organizationId, attribute.attributeName) }
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
    return {
      resource: filter.resource,
      userField: doc.userField,
      queryField: filter.queryField,
      value: filter.value
    }
  }

  // query ES with filter
  const esQuery = buildEsQueryFromFilter(filter)
  const result = await esClient.search(esQuery)

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
  const filtered = results.filter(item => {
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
  const { checkIfExists, getAuthUser } = require('./helper')
  logger.debug(`Searching ES first: ${JSON.stringify(args, null, 2)}`)
  // path and query parameters
  const params = args[0]
  const authUser = args[1]
  const doc = DOCUMENTS[resource]
  const userDoc = DOCUMENTS.user
  const topSubDoc = SUB_DOCUMENTS[resource]
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
    let authUserOrganizationId // Fetch and hold organizationId so subsequent filter resolution needn't make the same DB query to fetch it again
    for (const key of filterKey) {
      const resolved = await resolveUserFilterFromDb(userFilters[key], authUser, authUserOrganizationId)
      resolvedUserFilters.push(resolved)
    }

    if (params.orderBy) {
      sortClause = sortClause.concat(await resolveSortClauseFromDb(params.orderBy, authUser, authUserOrganizationId))
    }
  }

  // construct ES query
  const esQuery = {
    index: doc.userField ? userDoc.index : doc.index,
    type: doc.userField ? userDoc.type : doc.type,
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
  if (authUser.roles && !checkIfExists(authUser.roles, [appConst.UserRoles.admin, appConst.UserRoles.administrator])) {
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
      esQuery._source_excludes = SUB_PROPERTIES.join(',')
    }
  } else if (topSubDoc) {
    // add userId match
    const userFC = FILTER_CHAIN.user
    const userIdMatchField = `${userFC.idField}.keyword`
    esQuery.body.query.bool.must.push({
      match: {
        [userIdMatchField]: params.userId
      }
    })
    esQuery._source_includes = topSubDoc.userField
  }

  // set pre res filter results
  if (!params.enrich && preResFilterResults.length > 0) {
    for (const filter of preResFilterResults) {
      const matchField = filter.userField ? `${filter.userField}.${filter.queryField}` : `${filter.queryField}`
      setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
    }
  }

  const ownResFilters = parseResourceFilter(resource, params, true)
  // set it's own res filter to the main query
  if (!params.enrich && ownResFilters.length > 0) {
    setResourceFilterToEsQuery(ownResFilters, esQuery)
  }

  logger.debug(`ES query for search ${resource}: ${JSON.stringify(esQuery, null, 2)}`)
  const docs = await esClient.search(esQuery)
  if (docs.hits && getTotalCount(docs.hits.total) === 0) {
    return { total: docs.hits.total, page: params.page, perPage: params.perPage, result: [] }
  }

  let result = []
  if (resource === 'user' && params.enrich) {
    const users = docs.hits.hits.map(hit => hit._source)
    result = await enrichUsers(users)
    // enrich groups
    for (const user of users) {
      const groups = await groupApi.getGroups(user.id)
      user.groups = groups
    }
  } else if (topSubDoc) {
    result = docs.hits.hits[0]._source[topSubDoc.userField]
    // for sub-resource query, it returns all sub-resource items in one user,
    // so needs filtering and also page size
    result = applySubResFilters(result, preResFilterResults, ownResFilters, params.perPage)
  } else {
    result = docs.hits.hits.map(hit => hit._source)
  }

  return { total: docs.hits.total, page: params.page, perPage: params.perPage, result }
}

async function publishMessage (op, resource, result) {
  const { postEvent } = require('./helper')

  if (!OP_TO_TOPIC[op]) {
    logger.warn(`Invalid operation: ${op}`)
    return
  }

  logger.debug(`Publishing message to bus: resource ${resource}, data ${JSON.stringify(result, null, 2)}`)

  // Send Kafka message using bus api
  await postEvent(OP_TO_TOPIC[op], _.assign({ resource: resource }, result))
}

/**
 * Wrap QLDB methods with ES methods. Specifically read ES before QLDB for read operations, publish message
 * after QLDB for write operations.
 * @param methods QLDB CRUD methods
 * @param Model the model to access
 * @returns {{}} ES wrapped CRUD methods
 */
function wrapElasticSearchOp (methods, Model) {
  logger.info('Decorating ES to API methods')

  // methods: create, search, patch, get, remove
  const resource = getResource(Model.name)

  return _.mapValues(methods, func => {
    if (func.name === 'search') {
      return async (...args) => {
        try {
          return await searchElasticSearch(resource, ...args)
        } catch (err) {
          // return error if enrich fails
          if (resource === 'user' && args[0].enrich) {
            throw errors.elasticSearchEnrichError(err.message)
          }
          logger.logFullError(err)
          const { items, meta } = await func(...args)
          // return fromDB:true to indicate it is got from db,
          // and response headers ('X-Total', 'X-Page', etc.) are not set in this case
          return { fromDB: true, total: meta.total, result: items }
        }
      }
    } else if (func.name === 'get') {
      const { permissionCheck } = require('./helper')
      return async (...args) => {
        if (args[3]) {
          // merge query to params if exists. req.query was added at the end not to break the existing QLDB code.
          args[2] = _.assign(args[2], args[3])
        }
        try {
          const result = await getFromElasticSearch(resource, ...args)
          // check permission
          const authUser = args[1]
          permissionCheck(authUser, result)
          return result
        } catch (err) {
          // return error if enrich fails or permission fails
          if ((resource === 'user' && args[2].enrich) || (err.status && err.status === 403)) {
            throw errors.elasticSearchEnrichError(err.message)
          }
          logger.logFullError(err)
          const result = await func(...args)
          return result
        }
      }
    } else {
      return async (...args) => {
        let result = await func(...args)
        // remove action returns undefined, pass id to elasticsearch
        if (func.name === 'remove') {
          if (SUB_DOCUMENTS[resource]) {
            result = _.assign({}, args[2])
          } else {
            result = {
              id: args[0]
            }
          }
        }
        try {
          await publishMessage(func.name, resource, result)
        } catch (err) {
          logger.logFullError(err)
        }
        return result
      }
    }
  })
}

async function searchUsers (authUser, filter, params) {
  const { checkIfExists, getAuthUser } = require('./helper')
  const queryDoc = DOCUMENTS.user

  if (!params.page) {
    params.page = 1
  }
  if (!params.perPage) {
    params.perPage = config.PAGE_SIZE
  }

  let sortClause = []

  const userFilters = parseUserFilter(filter)
  const resolvedUserFilters = []

  let authUserOrganizationId
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
  if (authUser.roles && !checkIfExists(authUser.roles, [appConst.UserRoles.admin, appConst.UserRoles.administrator])) {
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

  logger.debug(`ES query for searching users: ${JSON.stringify(esQuery, null, 2)}`)

  const docs = await esClient.search(esQuery)
  const users = docs.hits.hits.map(hit => hit._source)
  const result = await enrichUsers(users)
  // enrich groups
  for (const user of users) {
    const groups = await groupApi.getGroups(user.id)
    user.groups = groups
  }

  return { total: getTotalCount(docs.hits.total), page: params.page, perPage: params.perPage, result }
}

async function searchAttributeValues ({ attributeId, attributeValue }) {
  const esQuery = buildEsQueryToGetAttributeValues(attributeId, attributeValue)
  logger.debug(`ES query for searching attribute values: ${JSON.stringify(esQuery, null, 2)}`)

  const esResult = await esClient.search(esQuery)

  let result = esResult.hits.hits.map(hit => {
    return hit.inner_hits.attributes.hits.hits[0]._source
  })

  result = _.uniqBy(result, 'value') // de-dupe by value
  result = result.splice(0, 5) // keep only the first five matches

  return { result }
}

module.exports = {
  wrapElasticSearchOp,
  searchUsers,
  searchAttributeValues
}
