/**
 * the skillsProvider routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/ubahn/internal/jobs/clean': {
    post: {
      method: Controller.cleanUpTestData,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['all:skillsProvider']
    }
  }
}
