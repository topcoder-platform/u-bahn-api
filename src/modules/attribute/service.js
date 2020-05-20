/**
 * the attribute group services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.Attribute,
  { // create request body joi schema
    name: joi.string().required(),
    attributeGroupId: joi.string().required()
  },
  { // patch request body joi schema
    name: joi.string(),
    attributeGroupId: joi.string()
  },
  { // search request query joi schema
    name: joi.string(),
    attributeGroupId: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = []
    // filter by provider name
    if (query.name) {
      dbQueries.push(`name like '%${query.name}%'`)
    }
    // filter by attribute group id
    if (query.attributeGroupId) {
      dbQueries.push(`attributeGroupId = '${query.attributeGroupId}'`)
    }
    return dbQueries
  },
  [['name', 'attributeGroupId']] // unique fields
)

module.exports = {
  ...methods
}
