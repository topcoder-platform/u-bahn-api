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
    uri: joi.string().required()
  },
  { // patch request body joi schema
    userId: joi.string().required(),
    organizationId: joi.string().required(),
    uri: joi.string()
  },
  { // search request query joi schema
    userId: joi.string().required(),
    organizationName: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = ['SELECT * FROM Organization, ExternalProfile',
      `ExternalProfile.userId = '${query.userId}'`,
      'ExternalProfile.organizationId = Organization.id']
    // filter by organization name
    if (query.organizationName) {
      dbQueries.push(`Organization.name like '%${query.organizationName}%'`)
    }
    return dbQueries
  },
  [['userId', 'organizationId']] // unique fields
)

module.exports = {
  ...methods
}
