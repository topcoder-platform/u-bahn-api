/**
 * This module contains es resources configuration.
 * Identical to the one from ES processor, but updated to work with the api
 */

const config = require('config')

const topResources = {
  skillprovider: {
    index: config.get('ES.DOCUMENTS.skillprovider.index'),
    type: config.get('ES.DOCUMENTS.skillprovider.type'),
    enrich: {
      policyName: 'skillprovider-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    },
    pipeline: {
      id: 'skillprovider-pipeline',
      field: 'skillProviderId',
      targetField: 'skillprovider',
      maxMatches: '1'
    }
  },

  role: {
    index: config.get('ES.DOCUMENTS.role.index'),
    type: config.get('ES.DOCUMENTS.role.type'),
    enrich: {
      policyName: 'role-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    }
  },

  achievementprovider: {
    index: config.get('ES.DOCUMENTS.achievementprovider.index'),
    type: config.get('ES.DOCUMENTS.achievementprovider.type'),
    enrich: {
      policyName: 'achievementprovider-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    }
  },

  attributegroup: {
    index: config.get('ES.DOCUMENTS.attributegroup.index'),
    type: config.get('ES.DOCUMENTS.attributegroup.type'),
    enrich: {
      policyName: 'attributegroup-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'organizationId', 'created', 'updated', 'createdBy', 'updatedBy']
    },
    pipeline: {
      id: 'attributegroup-pipeline',
      field: 'attributeGroupId',
      targetField: 'attributegroup',
      maxMatches: '1'
    }
  },

  skill: {
    index: config.get('ES.DOCUMENTS.skill.index'),
    type: config.get('ES.DOCUMENTS.skill.type'),
    enrich: {
      policyName: 'skill-policy',
      matchField: 'id',
      enrichFields: ['id', 'skillProviderId', 'name', 'externalId', 'uri', 'created', 'updated', 'createdBy', 'updatedBy', 'skillprovider']
    },
    ingest: {
      pipeline: {
        id: 'skillprovider-pipeline'
      }
    }
  },

  attribute: {
    index: config.get('ES.DOCUMENTS.attribute.index'),
    type: config.get('ES.DOCUMENTS.attribute.type'),
    enrich: {
      policyName: 'attribute-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'attributeGroupId', 'created', 'updated', 'createdBy', 'updatedBy', 'attributegroup']
    },
    ingest: {
      pipeline: {
        id: 'attributegroup-pipeline'
      }
    }
  },

  organization: {
    index: config.get('ES.DOCUMENTS.organization.index'),
    type: config.get('ES.DOCUMENTS.organization.type'),
  },

  user: {
    index: config.get('ES.DOCUMENTS.user.index'),
    type: config.get('ES.DOCUMENTS.user.type'),
    pipeline: {
      id: 'user-pipeline',
      processors: [
        {
          referenceField: config.get('ES.DOCUMENTS.achievement.userField'),
          enrichPolicyName: 'achievementprovider-policy',
          field: '_ingest._value.achievementsProviderId',
          targetField: '_ingest._value.achievementprovider',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.externalprofile.userField'),
          enrichPolicyName: 'organization-policy',
          field: '_ingest._value.organizationId',
          targetField: '_ingest._value.organization',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userattribute.userField'),
          enrichPolicyName: 'attribute-policy',
          field: '_ingest._value.attributeId',
          targetField: '_ingest._value.attribute',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userrole.userField'),
          enrichPolicyName: 'role-policy',
          field: '_ingest._value.roleId',
          targetField: '_ingest._value.role',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userskill.userField'),
          enrichPolicyName: 'skill-policy',
          field: '_ingest._value.skillId',
          targetField: '_ingest._value.skill',
          maxMatches: '1'
        }
      ]
    }
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
    relateKey: 'skillProviderId',
    enrich: {
      policyName: 'organization-policy',
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy', 'skillProviders']
    }
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
