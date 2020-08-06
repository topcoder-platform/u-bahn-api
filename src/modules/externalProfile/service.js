/**
 * the external profile services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.ExternalProfile,
  { // create request body joi schema
    userId: joi.string().required(),
    organizationId: joi.string().required(),
    externalId: joi.string().required(),
    uri: joi.string(),
    isInactive: joi.boolean().default(false)
  },
  { // patch request body joi schema
    userId: joi.string().required(),
    organizationId: joi.string().required(),
    externalId: joi.string(),
    uri: joi.string(),
    isInactive: joi.boolean()
  },
  { // search request query joi schema
    userId: joi.string().required(),
    externalId: joi.string(),
    organizationName: joi.string(),
    isInactive: joi.boolean()
  },
  async (query) => { // build search query by request
    const dbQueries = ['SELECT * FROM Organization, ExternalProfile',
      `ExternalProfile.userId = '${query.userId}'`,
      'ExternalProfile.organizationId = Organization.id']
    // filter by organization name
    if (query.organizationName) {
      dbQueries.push(`Organization.name like '%${query.organizationName}%'`)
    }
    if (query.externalId) {
      dbQueries.push(`ExternalProfile.externalId = '${query.externalId}'`)
    }
    if (query.isInactive) {
      dbQueries.push(`ExternalProfile.isInactive = '${query.isInactive}'`)
    }

    return dbQueries
  },
  [['userId', 'organizationId']] // unique fields
)

module.exports = {
  ...methods
}
