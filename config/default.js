/**
 * the default config
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3001,

  CASCADE_PAUSE_MS: process.env.CASCADE_PAUSE_MS || 1000,

  AUTH_SECRET: process.env.AUTH_SECRET || 'CLIENT_SECRET',
  VALID_ISSUERS: process.env.VALID_ISSUERS ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://topcoder-dev.auth0.com/", "https://api.topcoder.com"]',

  PAGE_SIZE: process.env.PAGE_SIZE || 20,
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  API_VERSION: process.env.API_VERSION || 'api/1.0',

  DB_NAME: process.env.DB_NAME || 'ubahn-db',
  DB_USERNAME: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,

  AUTH0_URL: process.env.AUTH0_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  BUSAPI_URL: process.env.BUSAPI_URL || 'https://api.topcoder-dev.com/v5',

  KAFKA_ERROR_TOPIC: process.env.KAFKA_ERROR_TOPIC || 'common.error.reporting',
  KAFKA_MESSAGE_ORIGINATOR: process.env.KAFKA_MESSAGE_ORIGINATOR || 'u-bahn-api',

  // topics
  UBAHN_CREATE_TOPIC: process.env.UBAHN_CREATE_TOPIC || 'u-bahn.action.create',
  UBAHN_UPDATE_TOPIC: process.env.UBAHN_UPDATE_TOPIC || 'u-bahn.action.update',
  UBAHN_DELETE_TOPIC: process.env.UBAHN_DELETE_TOPIC || 'u-bahn.action.delete',
  UBAHN_AGGREGATE_TOPIC: process.env.UBAHN_AGGREGATE_TOPIC || 'u-bahn.action.aggregate',

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
    HOST: process.env.ES_HOST || 'http://localhost:9200',

    ELASTICCLOUD: {
      id: process.env.ELASTICCLOUD_ID,
      username: process.env.ELASTICCLOUD_USERNAME,
      password: process.env.ELASTICCLOUD_PASSWORD
    },

    // es mapping: _index, _type, _id
    DOCUMENTS: {
      achievementprovider: {
        index: process.env.ACHIEVEMENT_PROVIDER_INDEX || 'achievement_provider',
        type: '_doc',
        enrichPolicyName: process.env.ACHIEVEMENT_PROVIDER_ENRICH_POLICYNAME || 'achievementprovider-policy'
      },
      attribute: {
        index: process.env.ATTRIBUTE_INDEX || 'attribute',
        type: '_doc',
        enrichPolicyName: process.env.ATTRIBUTE_ENRICH_POLICYNAME || 'attribute-policy'
      },
      attributegroup: {
        index: process.env.ATTRIBUTE_GROUP_INDEX || 'attribute_group',
        type: '_doc',
        pipelineId: process.env.ATTRIBUTE_GROUP_PIPELINE_ID || 'attributegroup-pipeline',
        enrichPolicyName: process.env.ATTRIBUTE_GROUP_ENRICH_POLICYNAME || 'attributegroup-policy'
      },
      organization: {
        index: process.env.ORGANIZATION_INDEX || 'organization',
        type: '_doc',
        enrichPolicyName: process.env.ORGANIZATION_ENRICH_POLICYNAME || 'organization-policy'
      },
      role: {
        index: process.env.ROLE_INDEX || 'role',
        type: '_doc',
        enrichPolicyName: process.env.ROLE_ENRICH_POLICYNAME || 'role-policy'
      },
      skill: {
        index: process.env.SKILL_INDEX || 'skill',
        type: '_doc',
        enrichPolicyName: process.env.SKILL_ENRICH_POLICYNAME || 'skill-policy'
      },
      skillprovider: {
        index: process.env.SKILL_PROVIDER_INDEX || 'skill_provider',
        type: '_doc',
        pipelineId: process.env.SKILL_PROVIDER_PIPELINE_ID || 'skillprovider-pipeline',
        enrichPolicyName: process.env.SKILL_PROVIDER_ENRICH_POLICYNAME || 'skillprovider-policy'
      },
      user: {
        index: process.env.USER_INDEX || 'user',
        type: '_doc',
        pipelineId: process.env.USER_PIPELINE_ID || 'user-pipeline'
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
    },
    MAX_RESULT_SIZE: parseInt(process.env.MAX_RESULT_SIZE, 10) || 1000,
    MAX_BULK_SIZE: parseInt(process.env.MAX_BULK_SIZE, 10) || 100
  }
}
