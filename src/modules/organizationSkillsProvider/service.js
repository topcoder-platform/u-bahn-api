/**
 * the organization skills provider services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.OrganizationSkillsProvider,
  {
    organizationId: joi.string().required(),
    skillProviderId: joi.string().required()
  },
  {
    organizationId: joi.string(),
    skillProviderId: joi.string()
  },
  {
    organizationId: joi.string().required()
  },
  async (query) => [`organizationId = '${query.organizationId}'`],
  [['organizationId', 'skillProviderId']])

module.exports = {
  ...methods
}
