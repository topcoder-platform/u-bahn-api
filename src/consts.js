const config = require('config')
const _ = require('lodash')
const Joi = require('@hapi/joi')

/**
 * because of circular dependency with `common/helper.js`, so put the code here
 * Function to valid require keys
 * @param {Object} payload validated object
 * @param {Array} keys required keys
 * @throws {Error} if required key absent
 */
function validProperties (payload, keys) {
  const schema = Joi.object(_.fromPairs(_.map(keys, key => [key, Joi.string().uuid().required()]))).unknown(true)
  const error = schema.validate(payload).error
  if (error) {
    throw error
  }
}



/**
 * roles that used in service, all roles must match topcoder roles
 * Admin and Administrator are both admin user
 */
const UserRoles = {
  admin: 'Admin',
  administrator: 'Administrator',
  topcoderUser: 'Topcoder User',
  copilot: 'Copilot',
  ubahn: 'u-bahn'
}
/**
 * all authenticated users.
 * @type {(string)[]}
 */
const AllAuthenticatedUsers = [
  UserRoles.admin,
  UserRoles.administrator,
  UserRoles.topcoderUser,
  UserRoles.copilot,
  UserRoles.ubahn
]


/**
 * all admin user
 */
const AdminUser = [UserRoles.admin, UserRoles.administrator]

/**
 * es config TopResources
 */
const TopResources = {
  achievementprovider: {
    index: config.get('ES.DOCUMENTS.achievementprovider.index'),
    type: config.get('ES.DOCUMENTS.achievementprovider.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.achievementprovider.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    }
  },
  attribute: {
    index: config.get('ES.DOCUMENTS.attribute.index'),
    type: config.get('ES.DOCUMENTS.attribute.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.attribute.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'attributeGroupId', 'created', 'updated', 'createdBy', 'updatedBy', 'attributegroup']
    },
    ingest: {
      pipeline: {
        id: config.get('ES.DOCUMENTS.attributegroup.pipelineId')
      }
    }
  },
  attributegroup: {
    index: config.get('ES.DOCUMENTS.attributegroup.index'),
    type: config.get('ES.DOCUMENTS.attributegroup.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.attributegroup.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'organizationId', 'created', 'updated', 'createdBy', 'updatedBy']
    },
    pipeline: {
      id: config.get('ES.DOCUMENTS.attributegroup.pipelineId'),
      field: 'attributeGroupId',
      targetField: 'attributegroup',
      maxMatches: '1'
    }
  },
  organization: {
    index: config.get('ES.DOCUMENTS.organization.index'),
    type: config.get('ES.DOCUMENTS.organization.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.organization.enrichPolicyName')
    }
  },
  role: {
    index: config.get('ES.DOCUMENTS.role.index'),
    type: config.get('ES.DOCUMENTS.role.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.role.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    }
  },
  skill: {
    index: config.get('ES.DOCUMENTS.skill.index'),
    type: config.get('ES.DOCUMENTS.skill.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.skill.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'skillProviderId', 'name', 'externalId', 'uri', 'created', 'updated', 'createdBy', 'updatedBy', 'skillprovider']
    },
    ingest: {
      pipeline: {
        id: config.get('ES.DOCUMENTS.skillprovider.pipelineId')
      }
    }
  },
  skillprovider: {
    index: config.get('ES.DOCUMENTS.skillprovider.index'),
    type: config.get('ES.DOCUMENTS.skillprovider.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.skillprovider.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    },
    pipeline: {
      id: config.get('ES.DOCUMENTS.skillprovider.pipelineId'),
      field: 'skillProviderId',
      targetField: 'skillprovider',
      maxMatches: '1'
    }
  },
  user: {
    index: config.get('ES.DOCUMENTS.user.index'),
    type: config.get('ES.DOCUMENTS.user.type'),
    ingest: {
      pipeline: {
        id: config.get('ES.DOCUMENTS.user.pipelineId')
      }
    },
    pipeline: {
      id: config.get('ES.DOCUMENTS.user.pipelineId'),
      processors: [
        {
          referenceField: config.get('ES.DOCUMENTS.achievement.userField'),
          enrichPolicyName: config.get('ES.DOCUMENTS.achievementprovider.enrichPolicyName'),
          field: '_ingest._value.achievementsProviderId',
          targetField: '_ingest._value.achievementprovider',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userattribute.userField'),
          enrichPolicyName: config.get('ES.DOCUMENTS.attribute.enrichPolicyName'),
          field: '_ingest._value.attributeId',
          targetField: '_ingest._value.attribute',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userrole.userField'),
          enrichPolicyName: config.get('ES.DOCUMENTS.role.enrichPolicyName'),
          field: '_ingest._value.roleId',
          targetField: '_ingest._value.role',
          maxMatches: '1'
        },
        {
          referenceField: config.get('ES.DOCUMENTS.userskill.userField'),
          enrichPolicyName: config.get('ES.DOCUMENTS.skill.enrichPolicyName'),
          field: '_ingest._value.skillId',
          targetField: '_ingest._value.skill',
          maxMatches: '1'
        }
      ]
    }
  }
}

/**
 * es config UserResources
 */
const UserResources = {
  achievement: {
    propertyName: config.get('ES.USER_ACHIEVEMENT_PROPERTY_NAME'),
    relateKey: 'achievementsProviderId',
    validate: payload => validProperties(payload, ['userId', 'achievementsProviderId'])
  },
  externalprofile: {
    propertyName: config.get('ES.USER_EXTERNALPROFILE_PROPERTY_NAME'),
    relateKey: 'organizationId',
    validate: payload => validProperties(payload, ['userId', 'organizationId'])
  },
  userattribute: {
    propertyName: config.get('ES.USER_ATTRIBUTE_PROPERTY_NAME'),
    relateKey: 'attributeId',
    validate: payload => validProperties(payload, ['userId', 'attributeId']),
    isNested: true // For ES index creation
  },
  userrole: {
    propertyName: config.get('ES.USER_ROLE_PROPERTY_NAME'),
    relateKey: 'roleId',
    validate: payload => validProperties(payload, ['userId', 'roleId'])
  },
  userskill: {
    propertyName: config.get('ES.USER_SKILL_PROPERTY_NAME'),
    relateKey: 'skillId',
    validate: payload => validProperties(payload, ['userId', 'skillId'])
  }
}

/**
 * es config OrganizationResources
 */
const OrganizationResources = {
  organizationskillprovider: {
    propertyName: config.get('ES.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME'),
    relateKey: 'skillProviderId',
    validate: payload => validProperties(payload, ['organizationId', 'skillProviderId']),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.organization.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy', 'skillProviders']
    }
  }
}

module.exports = {
  UserRoles,
  AllAuthenticatedUsers,
  AdminUser,
  TopResources,
  UserResources,
  OrganizationResources
}
