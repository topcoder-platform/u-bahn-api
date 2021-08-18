const config = require('config')
const Joi = require('@hapi/joi')
const querystring = require('querystring')
const errors = require('./errors')
const appConst = require('../consts')
const axios = require('axios')
const m2mAuth = require('tc-core-library-js').auth.m2m
const _ = require('lodash')
const { getControllerMethods, getSubControllerMethods } = require('./controller-helper')
const logger = require('./logger')
const busApi = require('tc-bus-api-wrapper')
const busApiClient = busApi(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET', 'BUSAPI_URL', 'KAFKA_ERROR_TOPIC', 'AUTH0_PROXY_SERVER_URL']))
const topcoderM2M = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))

/**
 * Function to valid require keys
 * @param {Object} payload validated object
 * @param {Array} keys required keys
 * @throws {Error} if required key absent
 */
function validProperties (payload, keys) {
  const schema = Joi.object(_.fromPairs(_.map(keys, key => [key, Joi.string().uuid().required()]))).unknown(true)
  const error = schema.validate(payload).error
  if (error) {
    throw error
  }
}

/**
 * get auth user handle or id
 * @param authUser the user
 */
function getAuthUser (authUser) {
  return authUser.handle || authUser.sub
}

/* Function to get M2M token
 * (Topcoder APIs only)
 * @returns {Promise}
 */
async function getTopcoderM2Mtoken () {
  return topcoderM2M.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Returns the user in Topcoder identified by the email
 * @param {String} email The user email
 */
async function getUserGroup (memberId) {
  const url = config.TOPCODER_GROUP_API
  const token = await getTopcoderM2Mtoken()
  const params = { memberId, membershipType: 'user', page: 1 }

  logger.debug(`request GET ${url} with params: ${JSON.stringify(params)}`)
  let groups = []
  let groupRes = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params })
  while (groupRes.data.length > 0) {
    groups = _.concat(groups, _.map(groupRes.data, g => _.pick(g, 'id', 'name')))
    params.page = params.page + 1
    groupRes = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params })
  }
  return groups
}

/**
 * Checks if the source matches the term.
 *
 * @param {Array} source the array in which to search for the term
 * @param {Array | String} term the term to search
 */
function checkIfExists (source, term) {
  let terms

  if (!_.isArray(source)) {
    throw new Error('Source argument should be an array')
  }

  source = source.map(s => s.toLowerCase())

  if (_.isString(term)) {
    terms = term.split(' ')
  } else if (_.isArray(term)) {
    terms = term.map(t => t.toLowerCase())
  } else {
    throw new Error('Term argument should be either a string or an array')
  }

  for (let i = 0; i < terms.length; i++) {
    if (source.includes(terms[i])) {
      return true
    }
  }

  return false
}

/**
 * Get link for a given page.
 * @param {Object} req the HTTP request
 * @param {Number} page the page number
 * @returns {String} link for the page
 */
function getPageLink (req, page) {
  const q = _.assignIn({}, req.query, { page })
  return `${req.protocol}://${req.get('Host')}${req.baseUrl}${req.path}?${querystring.stringify(q)}`
}

/**
 * Set HTTP response headers from result.
 * @param {Object} req the HTTP request
 * @param {Object} res the HTTP response
 * @param {Object} result the operation result
 */
function injectSearchMeta (req, res, result) {
  // if result is got from db, then do not set response headers
  if (result.fromDB) {
    return
  }

  const resultTotal = _.isNumber(result.total) ? result.total : result.total.value

  const totalPages = Math.ceil(resultTotal / result.perPage)
  if (result.page > 1) {
    res.set('X-Prev-Page', +result.page - 1)
  }
  if (result.page < totalPages) {
    res.set('X-Next-Page', +result.page + 1)
  }
  res.set('X-Page', result.page)
  res.set('X-Per-Page', result.perPage)
  res.set('X-Total', resultTotal)
  res.set('X-Total-Pages', totalPages)
  // set Link header
  if (totalPages > 0) {
    let link = `<${getPageLink(req, 1)}>; rel="first", <${getPageLink(req, totalPages)}>; rel="last"`
    if (result.page > 1) {
      link += `, <${getPageLink(req, result.page - 1)}>; rel="prev"`
    }
    if (result.page < totalPages) {
      link += `, <${getPageLink(req, result.page + 1)}>; rel="next"`
    }
    res.set('Link', link)
  }

  // Allow browsers access pagination data in headers
  let accessControlExposeHeaders = res.get('Access-Control-Expose-Headers') || ''
  accessControlExposeHeaders += accessControlExposeHeaders ? ', ' : ''
  // append new values, to not override values set by someone else
  accessControlExposeHeaders += 'X-Page, X-Per-Page, X-Total, X-Total-Pages, X-Prev-Page, X-Next-Page'

  res.set('Access-Control-Expose-Headers', accessControlExposeHeaders)
}

/**
 * some user can only access devices that they created. admin role user can access all devices
 * @param auth the auth object
 * @param recordObj the record object
 */
function permissionCheck (auth, recordObj) {
  if (
    auth &&
    auth.roles &&
    !checkIfExists(auth.roles, appConst.AdminUser) &&
    !checkIfExists(auth.roles, [appConst.UserRoles.ubahn]) &&
    recordObj.createdBy !== getAuthUser(auth)) {
    throw errors.newPermissionError('You are not allowed to perform this action')
  }
}

/**
 * Send Kafka event message
 * @params {String} topic the topic name
 * @params {Object} payload the payload
 */
async function postEvent (topic, payload) {
  logger.debug(`Posting event to Kafka topic ${topic}, ${JSON.stringify(payload, null, 2)}`)
  const message = {
    topic,
    originator: config.KAFKA_MESSAGE_ORIGINATOR,
    timestamp: new Date().toISOString(),
    'mime-type': 'application/json',
    payload
  }
  await busApiClient.postEvent(message)

  // Post to the aggregate topic
  message.payload.originalTopic = topic
  message.topic = config.UBAHN_AGGREGATE_TOPIC
  logger.debug(`Posting event to aggregate topic ${message.topic}`)
  await busApiClient.postEvent(message)
}

/**
 * Send error event to Kafka
 * @params {String} topic the topic name
 * @params {Object} payload the payload
 * @params {String} action for which operation error occurred
 */
async function publishError (topic, payload, action) {
  _.set(payload, 'apiAction', action)
  const message = {
    topic,
    originator: config.KAFKA_MESSAGE_ORIGINATOR,
    timestamp: new Date().toISOString(),
    'mime-type': 'application/json',
    payload
  }
  logger.debug(`Publish error to Kafka topic ${topic}, ${JSON.stringify(message, null, 2)}`)
  await busApiClient.postEvent(message)
}

/**
 * Fuction to get an Error with statusCode property
 * @param {String} message error message
 * @param {Number} statusCode
 * @returns {Error} an Error with statusCode property
 */
function getErrorWithStatus (message, statusCode) {
  const error = Error(message)
  error.statusCode = statusCode
  return error
}

module.exports = {
  validProperties,
  getAuthUser,
  getUserGroup,
  permissionCheck,
  checkIfExists,
  injectSearchMeta,
  getControllerMethods,
  getSubControllerMethods,
  postEvent,
  publishError,
  getErrorWithStatus
}
