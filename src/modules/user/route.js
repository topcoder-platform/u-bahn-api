/**
 * the user routes
 */

const Controller = require('./controller')
const consts = require('../../consts')

module.exports = {
  '/users': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:user', 'all:user']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:user', 'all:user']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:user', 'all:user']
    }
  },
  '/users/:id': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:user', 'all:user']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:user', 'all:user']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:user', 'all:user']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['delete:user', 'all:user']
    }
  }
}
