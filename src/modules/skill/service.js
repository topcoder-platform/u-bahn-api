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
  async () => [])

module.exports = {
  ...methods
}
