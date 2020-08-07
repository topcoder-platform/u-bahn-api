/**
 * the user attribute services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.UserAttribute,
  { // create request body joi schema
    userId: joi.string().required(),
    attributeId: joi.string().required(),
    value: joi.string().required()
  },
  { // patch request body joi schema
    userId: joi.string().required(),
    attributeId: joi.string().required(),
    value: joi.string()
  },
  { // search request query joi schema
    userId: joi.string().required(),
    attributeName: joi.string(),
    attributeGroupName: joi.string(),
    attributeGroupId: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = ['SELECT * FROM Attribute, AttributeGroup, UserAttribute',
      `UserAttribute.userId = '${query.userId}'`,
      'UserAttribute.attributeId=Attribute.id',
      'Attribute.attributeGroupId = AttributeGroup.id']
    // filter by attribute name
    if (query.attributeName) {
      dbQueries.push(`Attribute.name like '%${query.attributeName}%'`)
    }
    // filter by attribute group name
    if (query.attributeGroupName) {
      dbQueries.push(`AttributeGroup.name like '%${query.attributeGroupName}%'`)
    }
    // filter by attribute group id
    if (query.attributeGroupId) {
      dbQueries.push(`AttributeGroup.id = '${query.attributeGroupId}'`)
    }
    return dbQueries
  },
  [['userId', 'attributeId']] // unique fields
)

module.exports = {
  ...methods
}
