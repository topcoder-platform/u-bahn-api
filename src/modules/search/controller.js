/**
 * The search controller
 */
const esHelper = require('../../common/es-helper')
const { injectSearchMeta } = require('../../common/helper')

/**
 * Search for users. Returns enriched users
 */
async function searchUsers (req, res) {
  const result = await esHelper.searchUsers(req.auth, req.body, req.query)
  injectSearchMeta(req, res, result)
  res.send(result.result)
}

/**
 * Search for skills in organization
 */
async function searchSkills (req, res) {
  const result = await esHelper.searchSkillsInOrganization(req.query)
  res.send(result.result)
}

/**
 * Search for attribute values
 */
async function searchAttributeValues (req, res) {
  const result = await esHelper.searchAttributeValues(req.query)
  res.send(result.result)
}

/**
 * Search for achievement values
 */
async function searchAchievementValues (req, res) {
  const result = await esHelper.searchAchievementValues(req.query)
  res.send(result.result)
}

module.exports = {
  searchUsers,
  searchSkills,
  searchAttributeValues,
  searchAchievementValues
}
