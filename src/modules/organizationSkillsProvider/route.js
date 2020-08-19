/**
 * the organization skills provider routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/organizations/:organizationId/skillProviders': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:organizationSkillsProvider', 'all:organizationSkillsProvider']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:organizationSkillsProvider', 'all:organizationSkillsProvider']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:organizationSkillsProvider', 'all:organizationSkillsProvider']
    }
  },
  '/organizations/:organizationId/skillProviders/:skillProviderId': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:organizationSkillsProvider', 'all:organizationSkillsProvider']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:organizationSkillsProvider', 'all:organizationSkillsProvider']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['delete:organizationSkillsProvider', 'all:organizationSkillsProvider']
    }
  }
}
