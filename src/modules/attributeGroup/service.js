/**
 * the attribute group provider services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.AttributeGroup,
  { // create request body joi schema
    name: joi.string().required(),
    organizationId: joi.string().required()
  },
  { // patch request body joi schema
    name: joi.string(),
    organizationId: joi.string()
  },
  { // search request query joi schema
    name: joi.string(),
    organizationId: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = []
    // filter by provider name
    if (query.name) {
      dbQueries.push(`name like '%${query.name}%'`)
    }
    if (query.organizationId) {
      dbQueries.push(`organizationId = '${query.organizationId}'`)
    }
    return dbQueries
  },
  [['name']] // unique fields
)

module.exports = {
  ...methods
}
