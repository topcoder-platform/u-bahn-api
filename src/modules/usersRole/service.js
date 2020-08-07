/**
 * the skill services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.UsersRole,
  {
    userId: joi.string().required(),
    roleId: joi.string().required()
  },
  {
    userId: joi.string(),
    roleId: joi.string()
  },
  {
    userId: joi.string().required()
  },
  async (query) => [`userId = '${query.userId}'`],
  [['userId', 'roleId']])

module.exports = {
  ...methods
}
