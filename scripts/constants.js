/**
 * This module contains es resources configuration.
 * Identical to the one from ES processor, but updated to work with the api
 */

const config = require('config')

const topResources = {
  achievementprovider: {
    index: config.get('ES.DOCUMENTS.achievementprovider.index'),
    type: config.get('ES.DOCUMENTS.achievementprovider.type')
  },
  attribute: {
    index: config.get('ES.DOCUMENTS.attribute.index'),
    type: config.get('ES.DOCUMENTS.attribute.type')
  },
  attributegroup: {
    index: config.get('ES.DOCUMENTS.attributegroup.index'),
    type: config.get('ES.DOCUMENTS.attributegroup.type')
  },
  organization: {
    index: config.get('ES.DOCUMENTS.organization.index'),
    type: config.get('ES.DOCUMENTS.organization.type')
  },
  role: {
    index: config.get('ES.DOCUMENTS.role.index'),
    type: config.get('ES.DOCUMENTS.role.type')
  },
  skill: {
    index: config.get('ES.DOCUMENTS.skill.index'),
    type: config.get('ES.DOCUMENTS.skill.type')
  },
  skillprovider: {
    index: config.get('ES.DOCUMENTS.skillprovider.index'),
    type: config.get('ES.DOCUMENTS.skillprovider.type')
  },
  user: {
    index: config.get('ES.DOCUMENTS.user.index'),
    type: config.get('ES.DOCUMENTS.user.type')
  }
}

const userResources = {
  achievement: {
    propertyName: config.get('ES.DOCUMENTS.achievement.userField'),
    relateKey: 'achievementsProviderId'
  },
  externalprofile: {
    propertyName: config.get('ES.DOCUMENTS.externalprofile.userField'),
    relateKey: 'organizationId'
  },
  userattribute: {
    propertyName: config.get('ES.DOCUMENTS.userattribute.userField'),
    relateKey: 'attributeId',
    nested: true
  },
  userrole: {
    propertyName: config.get('ES.DOCUMENTS.userrole.userField'),
    relateKey: 'roleId'
  },
  userskill: {
    propertyName: config.get('ES.DOCUMENTS.userskill.userField'),
    relateKey: 'skillId'
  }
}

const organizationResources = {
  organizationskillprovider: {
    propertyName: config.get('ES.DOCUMENTS.organizationskillprovider.orgField'),
    relateKey: 'skillProviderId'
  }
}

const modelToESIndexMapping = {
  User: 'user',
  Role: 'role',
  SkillsProvider: 'skillprovider',
  Organization: 'organization',
  Skill: 'skill',
  UsersRole: 'userrole',
  UsersSkill: 'userskill',
  Achievement: 'achievement',
  ExternalProfile: 'externalprofile',
  AchievementsProvider: 'achievementprovider',
  AttributeGroup: 'attributegroup',
  Attribute: 'attribute',
  UserAttribute: 'userattribute',
  OrganizationSkillsProvider: 'organizationskillprovider'
}

module.exports = {
  topResources,
  userResources,
  organizationResources,
  modelToESIndexMapping
}
