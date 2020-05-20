/**
 * the attribute group routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/attributeGroups': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:attributeGroup', 'all:attributeGroup']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:attributeGroup', 'all:attributeGroup']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:attributeGroup', 'all:attributeGroup']
    }
  },
  '/attributeGroups/:id': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:attributeGroup', 'all:attributeGroup']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:attributeGroup', 'all:attributeGroup']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:attributeGroup', 'all:attributeGroup']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: consts.AdminUser,
      scopes: ['delete:attributeGroup', 'all:attributeGroup']
    }
  }
}
