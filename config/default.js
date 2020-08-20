/**
 * the default config
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3001,

  AUTH_SECRET: process.env.AUTH_SECRET || 'CLIENT_SECRET',
  VALID_ISSUERS: process.env.VALID_ISSUERS ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://topcoder-dev.auth0.com/", "https://api.topcoder.com"]',

  PAGE_SIZE: process.env.PAGE_SIZE || 20,
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  API_VERSION: process.env.API_VERSION || 'api/1.0',

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  DATABASE: process.env.DATABASE || 'ubahn-db',

  AUTH0_URL: process.env.AUTH0_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  GROUP_API_URL: process.env.GROUP_API_URL || 'https://api.topcoder-dev.com/v5/groups',
  BUSAPI_URL: process.env.BUSAPI_URL || 'https://api.topcoder-dev.com/v5',

  KAFKA_ERROR_TOPIC: process.env.KAFKA_ERROR_TOPIC || 'common.error.reporting',
  KAFKA_MESSAGE_ORIGINATOR: process.env.KAFKA_MESSAGE_ORIGINATOR || 'u-bahn-api',

  // topics
  UBAHN_CREATE_TOPIC: process.env.UBAHN_CREATE_TOPIC || 'u-bahn.action.create',
  UBAHN_UPDATE_TOPIC: process.env.UBAHN_UPDATE_TOPIC || 'u-bahn.action.update',
  UBAHN_DELETE_TOPIC: process.env.UBAHN_DELETE_TOPIC || 'u-bahn.action.delete',

  EMSI: {
    CLIENT_ID: process.env.EMSI_CLIENT_ID,
    CLIENT_SECRET: process.env.EMSI_CLIENT_SECRET,
    GRANT_TYPE: process.env.EMSI_GRANT_TYPE || 'client_credentials',
    SCOPE: process.env.EMSI_SCOPE || 'emsi_open',
    AUTH_URL: process.env.EMSI_AUTH_URL || 'https://auth.emsicloud.com/connect/token',
    BASE_URL: process.env.EMSI_BASE_URL || 'https://skills.emsicloud.com/versions/latest'
  },

  EMSI_SKILLPROVIDER_ID: process.env.EMSI_SKILLPROVIDER_ID || '7637ae1a-3b7c-44eb-a5ed-10ea02f1885d',

  // ElasticSearch
  ES: {
    HOST: process.env.ES_HOST || 'localhost:9200',
    API_VERSION: process.env.ES_API_VERSION || '7.4',
    // es mapping: _index, _type, _id
    DOCUMENTS: {
      achievementprovider: {
        index: process.env.ACHIEVEMENT_PROVIDER_INDEX || 'achievement_provider',
        type: '_doc'
      },
      attribute: {
        index: process.env.ATTRIBUTE_INDEX || 'attribute',
        type: '_doc'
      },
      attributegroup: {
        index: process.env.ATTRIBUTE_GROUP_INDEX || 'attribute_group',
        type: '_doc'
      },
      organization: {
        index: process.env.ORGANIZATION_INDEX || 'organization',
        type: '_doc'
      },
      role: {
        index: process.env.ROLE_INDEX || 'role',
        type: '_doc'
      },
      skill: {
        index: process.env.SKILL_INDEX || 'skill',
        type: '_doc'
      },
      skillprovider: {
        index: process.env.SKILL_PROVIDER_INDEX || 'skill_provider',
        type: '_doc'
      },
      user: {
        index: process.env.USER_INDEX || 'user',
        type: '_doc'
      },
      // sub resources under user
      achievement: {
        userField: process.env.USER_ACHIEVEMENT_PROPERTY_NAME || 'achievements'
      },
      externalprofile: {
        userField: process.env.USER_EXTERNALPROFILE_PROPERTY_NAME || 'externalProfiles'
      },
      userattribute: {
        userField: process.env.USER_ATTRIBUTE_PROPERTY_NAME || 'attributes'
      },
      userrole: {
        userField: process.env.USER_ROLE_PROPERTY_NAME || 'roles'
      },
      userskill: {
        userField: process.env.USER_SKILL_PROPERTY_NAME || 'skills'
      },
      // sub resources under organization
      organizationskillprovider: {
        orgField: process.env.ORGANIZATION_SKILLPROVIDER_PROPERTY_NAME || 'skillProviders'
      }
    }
  }
}
