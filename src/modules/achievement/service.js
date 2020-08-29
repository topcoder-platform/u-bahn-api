/**
 * the achievement services
 */

const joi = require('@hapi/joi').extend(require('@hapi/joi-date'))
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.Achievement,
  { // create request body joi schema
    userId: joi.string().required(),
    achievementsProviderId: joi.string().required(),
    name: joi.string().required(),
    uri: joi.string(),
    certifierId: joi.string().allow(),
    certifiedDate: joi.date().format('iso')
  },
  { // patch request body joi schema
    userId: joi.string().required(),
    achievementsProviderId: joi.string().required(),
    name: joi.string(),
    uri: joi.string(),
    certifierId: joi.string().allow(),
    certifiedDate: joi.date().format('iso')
  },
  { // search request query joi schema
    userId: joi.string().required(),
    achievementsProviderName: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = ['SELECT * FROM AchievementsProvider, Achievement',
      `Achievement.userId = '${query.userId}'`,
      'Achievement.achievementsProviderId = AchievementsProvider.id']
    // filter by achievements provider name
    if (query.achievementsProviderName) {
      dbQueries.push(`AchievementsProvider.name like '%${query.achievementsProviderName}%'`)
    }
    return dbQueries
  },
  [['userId', 'achievementsProviderId']] // unique fields
)

module.exports = {
  ...methods
}
