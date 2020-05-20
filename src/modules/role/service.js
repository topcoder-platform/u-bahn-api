/**
 * the roles services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.Role,
  { name: joi.string().required() },
  { name: joi.string() },
  { name: joi.string() },
  async query => {
    const dbQueries = []
    if (query.name) {
      dbQueries.push(`name like '%${query.name}%'`)
    }
    return dbQueries
  }, [['name']])

module.exports = {
  ...methods
}
