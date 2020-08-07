/**
 * the users skill routes
 */

const Controller = require('./controller')
const consts = require('../../consts')
module.exports = {
  '/users/:userId/skills': {
    get: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:usersSkill', 'all:usersSkill']
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['create:usersSkill', 'all:usersSkill']
    },
    head: {
      method: Controller.search,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:usersSkill', 'all:usersSkill']
    }
  },
  '/users/:userId/skills/:skillId': {
    get: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:usersSkill', 'all:usersSkill']
    },
    head: {
      method: Controller.get,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['read:usersSkill', 'all:usersSkill']
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      access: consts.AllAuthenticatedUsers,
      scopes: ['update:usersSkill', 'all:usersSkill']
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['delete:usersSkill', 'all:usersSkill']
    }
  }
}
