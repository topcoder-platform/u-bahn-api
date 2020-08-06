const axios = require('axios')
const config = require('config')
const querystring = require('querystring')
const NodeCache = require('node-cache')
const joi = require('@hapi/joi')
const orgSkillsProviderService = require('../organizationSkillsProvider/service')
const esHelper = require('../../common/es-helper')

// cache the emsi token
const tokenCache = new NodeCache()

/**
 * Format EMSI skills like the ones returned by the ES query
 * @param {Array} emsiSkills Array of skills
 */
function formatEmsiSkills (emsiSkills) {
  return emsiSkills.skills.slice(0, 10).map(skill => ({
    name: skill.name,
    skillId: skill.id,
    skillProviderId: config.EMSI_SKILLPROVIDER_ID
  }))
}

/**
 * Get emsi token
 * @returns {string} the emsi token
 */
async function getEmsiToken () {
  let token = tokenCache.get('emsi_token')
  if (!token) {
    const res = await axios.post(config.EMSI.AUTH_URL, querystring.stringify({
      client_id: config.EMSI.CLIENT_ID,
      client_secret: config.EMSI.CLIENT_SECRET,
      grant_type: config.EMSI.GRANT_TYPE,
      scope: config.EMSI.SCOPE
    }))
    token = res.data.access_token
    tokenCache.set('emsi_token', token, res.data.expires_in)
  }
  return token
}

/**
 * Get data from emsi
 * @param {String} path the emsi endpoint path
 * @param {String} params get params
 * @returns {Object} response data
 */
async function getEmsiObject (path, params) {
  const token = await getEmsiToken()
  const res = await axios.get(`${config.EMSI.BASE_URL}${path}`, { params, headers: { authorization: `Bearer ${token}` } })
  return res.data
}

/**
 * Get skills by query.
// !Proxies request to EMSI if org uses it as its skill provider
 * @param {String} query the query
 * @param {Object} auth the auth object
 * @returns {Object} the Object with skills
 */
async function getSkills (query, auth) {
  let result
  const skillProviderIds = await orgSkillsProviderService.search({ organizationId: query.organizationId }, auth)

  if (skillProviderIds.result.length === 1 && skillProviderIds.result[0].skillProviderId === config.EMSI_SKILLPROVIDER_ID) {
    result = await getEmsiObject('/skills', { q: query.keyword })
    return { result: formatEmsiSkills(result) }
  }

  result = await esHelper.searchSkillsInOrganization(query)

  return result
}

getSkills.schema = {
  query: joi.object().keys({
    organizationId: joi.string().required(),
    keyword: joi.string().required()
  }),
  auth: joi.object()
}

module.exports = { getSkills }
