/**
 * the achievement routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/users/:userId/achievements': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:achievement', 'all:achievement']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:achievement', 'all:achievement']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:achievement', 'all:achievement']
    }
  },
  '/users/:userId/achievements/:achievementsProviderId': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:achievement', 'all:achievement']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:achievement', 'all:achievement']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:achievement', 'all:achievement']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['delete:achievement', 'all:achievement']
    }
  }
}
