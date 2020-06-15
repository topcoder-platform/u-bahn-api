/**
 * the users services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.User,
  { handle: joi.string().required() },
  { handle: joi.string() },
  { handle: joi.string(), roleId: joi.string() },
  async query => {
    let prefix = 'select * from DUser'
    const dbQueries = []
    if (query.handle) {
      dbQueries.push(`DUser.handle like '%${query.handle}%'`)
    }
    if (query.roleId) {
      dbQueries.push(`Role.id = '${query.roleId}'`)
      prefix = 'select * from Role, UserRole, DUser'
      dbQueries.push('UserRole.userId = DUser.id')
      dbQueries.push('UserRole.roleId = Role.id')
    }
    return [prefix].concat(dbQueries)
  }, [['handle']])

module.exports = {
  ...methods
}
