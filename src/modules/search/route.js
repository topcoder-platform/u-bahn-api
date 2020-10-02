/**
 * the search routes
 */

const Controller = require('./controller')
const consts = require('../../consts')

module.exports = {
  '/skill-search/users': {
    post: {
      method: Controller.searchUsers,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['read:user', 'all:user']
    }
  },
  '/skill-search/skills': {
    get: {
      method: Controller.searchSkills,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['create:userAttribute', 'all:userAttribute']
    }
  },
  '/skill-search/userAttributes': {
    get: {
      method: Controller.searchAttributeValues,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['create:userAttribute', 'all:userAttribute']
    }
  },
  '/skill-search/userAchievements': {
    get: {
      method: Controller.searchAchievementValues,
      auth: 'jwt',
      access: [...consts.AdminUser, consts.UserRoles.ubahn],
      scopes: ['create:userAttribute', 'all:userAttribute']
    }
  }
}
