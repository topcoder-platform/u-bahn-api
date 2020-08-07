/**
 * the user attribute routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/users/:userId/attributes': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:userAttribute', 'all:userAttribute']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:userAttribute', 'all:userAttribute']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:userAttribute', 'all:userAttribute']
    }
  },
  '/users/:userId/attributes/:attributeId': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:userAttribute', 'all:userAttribute']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:userAttribute', 'all:userAttribute']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:userAttribute', 'all:userAttribute']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['delete:userAttribute', 'all:userAttribute']
    }
  }
}
