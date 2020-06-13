const config = require('config')
const _ = require('lodash')
const axios = require('axios')
const m2mAuth = require('tc-core-library-js').auth.m2m
const logger = require('./logger')

const m2m = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))

/**
 * Get M2M token.
 * @returns {Promise<unknown>}
 */
async function getM2Mtoken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

async function getGroups (universalUID) {
  const m2mToken = await getM2Mtoken()

  try {
    const resp = await axios({
      method: 'get',
      params: { universalUID },
      url: config.GROUP_API_URL,
      headers: { Authorization: `Bearer ${m2mToken}` }
    })
    return resp.data
  } catch (error) {
    logger.error(error)
    return []
  }
}

module.exports = {
  getM2Mtoken,
  getGroups
}
