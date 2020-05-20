/**
 * the skillsProvider routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/skillsProviders': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:skillsProvider', 'all:skillsProvider']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:skillsProvider', 'all:skillsProvider']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:skillsProvider', 'all:skillsProvider']
    }
  },
  '/skillsProviders/:id': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:skillsProvider', 'all:skillsProvider']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:skillsProvider', 'all:skillsProvider']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:skillsProvider', 'all:skillsProvider']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['delete:skillsProvider', 'all:skillsProvider']
    }
  }
}
