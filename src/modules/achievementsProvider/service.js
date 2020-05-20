/**
 * the achievements provider services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.AchievementsProvider,
  { // create request body joi schema
    name: joi.string().required()
  },
  { // patch request body joi schema
    name: joi.string()
  },
  { // search request query joi schema
    name: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = []
    // filter by provider name
    if (query.name) {
      dbQueries.push(`name like '%${query.name}%'`)
    }
    return dbQueries
  },
  [['name']] // unique fields
)

module.exports = {
  ...methods
}
