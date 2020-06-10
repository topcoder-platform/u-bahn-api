/**
 * the search routes
 */

const Controller = require('./controller')
const consts = require('../../consts')

module.exports = {
  '/search/users': {
    post: {
      method: Controller.searchUsers,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['read:user', 'all:user']
    }
  },
  '/search/userAttributes': {
    get: {
      method: Controller.searchAttributeValues,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['create:userAttribute', 'all:userAttribute']
    }
  }
}
