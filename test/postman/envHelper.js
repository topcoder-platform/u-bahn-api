/**
 * This file defines methods for getting access tokens
 */

const _ = require('lodash')
const axios = require('axios')
const config = require('config')
/**
 * Get user tokens from V2 API
 * @param {String} userName the user name
 * @param {String} userPassword the user password
 * @returns {Object} the user tokens
 */
async function getUserTokenV2 (userName, userPassword) {
  const { data } = await axios({
    method: 'post',
    url: config.AUTH_V2_URL,
    data: {
      username: userName,
      password: userPassword,
      client_id: config.AUTH_V2_CLIENT_ID,
      sso: false,
      scope: 'openid profile offline_access',
      response_type: 'token',
      connection: 'TC-User-Database',
      grant_type: 'password',
      device: 'Browser'
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    }
  })
  return data
}

/**
 * Get user token from V3 API
 * @param {String} idToken the id_token
 * @param {String} refreshToken the refresh_token
 * @returns {String} the user token
 */
async function getUserTokenV3 (idToken, refreshToken) {
  const { data } = await axios({
    method: 'post',
    url: config.AUTH_V3_URL,
    data: {
      param: {
        externalToken: idToken,
        refreshToken: refreshToken
      }
    },
    headers: {
      'cache-control': 'no-cache',
      authorization: `Bearer ${this.v2_token}`,
      'content-type': 'application/json;charset=UTF-8'
    }
  })
  return data
}

/**
 * Get admin token from V3 API
 * @returns {String} The admin token
 */
async function getAdminToken () {
  const v2 = await getUserTokenV2(config.ADMIN_CREDENTIALS_USERNAME, config.ADMIN_CREDENTIALS_PASSWORD)
  const v3 = await getUserTokenV3(v2.id_token, v2.refresh_token)
  return _.get(v3, 'result.content.token')
}

/**
 * Get regular user token from V3 API
 * @returns {String} The user token
 */
async function getUserToken () {
  const v2 = await getUserTokenV2(config.USER_CREDENTIALS_USERNAME, config.USER_CREDENTIALS_PASSWORD)
  const v3 = await getUserTokenV3(v2.id_token, v2.refresh_token)
  return _.get(v3, 'result.content.token')
}

/**
 * Uses axios to proxy post request
 * @param {String} url the url
 * @param {Object} data the query parameters, optional
 * @returns {Object} the response
 */
async function postRequest (url, data) {
  const adminToken = await getAdminToken()
  const { data: response } = await axios({
    method: 'post',
    url,
    data,
    headers: {
      'cache-control': 'no-cache',
      authorization: `Bearer ${adminToken}`,
      'content-type': 'application/json;charset=UTF-8'
    }
  })
  return response
}

module.exports = {
  getAdminToken,
  getUserToken,
  postRequest
}
