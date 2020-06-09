/**
 * the skill services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.Skill,
  {
    skillProviderId: joi.string().required(),
    name: joi.string().required(),
    uri: joi.string().required(),
    externalId: joi.string().required()
  },
  {
    skillProviderId: joi.string(),
    name: joi.string(),
    uri: joi.string(),
    externalId: joi.string()
  },
  {},
  async query => {
    const dbQueries = []
    if (query.externalId) {
      dbQueries.push(`externalId like '%${query.externalId}%'`)
    }
    if (query.skillProviderId) {
      dbQueries.push(`skillProviderId like '%${query.skillProviderId}%'`)
    }
    return dbQueries
  },
  [['skillProviderId', 'externalId']]
)

module.exports = {
  ...methods
}
