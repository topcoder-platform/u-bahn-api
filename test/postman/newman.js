const config = require('config')
const apiTestLib = require('tc-api-testing-lib')
const envHelper = require('./envHelper')
const logger = require('../../src/common/logger')

const requests = [
  {
    folder: 'search users with various parameters by admin',
    iterationData: require('./testData/user/search-users-with-various-parameters.json')
  },
  {
    folder: 'search users with various parameters by user',
    iterationData: require('./testData/user/search-users-with-various-parameters.json')
  },
  {
    folder: 'search users with invalid parameters',
    iterationData: require('./testData/user/search-users-with-invalid-parameters.json')
  },
  {
    folder: 'search users with all kinds of invalid token',
    iterationData: require('./testData/user/search-users-with-invalid-tokens.json')
  },
  {
    folder: 'head users with various parameters by admin',
    iterationData: require('./testData/user/search-users-with-various-parameters.json')
  },
  {
    folder: 'head users with various parameters by user',
    iterationData: require('./testData/user/search-users-with-various-parameters.json')
  },
  {
    folder: 'head users with invalid parameters',
    iterationData: require('./testData/user/search-users-with-invalid-parameters.json')
  },
  {
    folder: 'head users with all kinds of invalid token',
    iterationData: require('./testData/user/search-users-with-invalid-tokens.json')
  },
  {
    folder: 'create user by admin',
    iterationData: require('./testData/user/create-user-by-admin.json')
  },
  {
    folder: 'create user by user',
    iterationData: require('./testData/user/create-user-by-user.json')
  },
  {
    folder: 'create user with all kinds of invalid request body',
    iterationData: require('./testData/user/create-user-with-invalid-data.json')
  },
  {
    folder: 'create user with all kinds of invalid token',
    iterationData: require('./testData/user/create-user-with-invalid-tokens.json')
  },
  {
    folder: 'get user with various parameters by admin',
    iterationData: require('./testData/user/get-user-by-admin.json')
  },
  {
    folder: 'get user with various parameters by user',
    iterationData: require('./testData/user/get-user-by-user.json')
  },
  {
    folder: 'get user with invalid requests',
    iterationData: require('./testData/user/get-user-with-invalid-parameters.json')
  },
  {
    folder: 'get user with all kinds of invalid token',
    iterationData: require('./testData/user/get-user-with-invalid-tokens.json')
  },
  {
    folder: 'head user with various parameters by admin',
    iterationData: require('./testData/user/get-user-by-admin.json')
  },
  {
    folder: 'head user with various parameters by user',
    iterationData: require('./testData/user/get-user-by-user.json')
  },
  {
    folder: 'head user with invalid requests',
    iterationData: require('./testData/user/get-user-with-invalid-parameters.json')
  },
  {
    folder: 'head user with all kinds of invalid token',
    iterationData: require('./testData/user/get-user-with-invalid-tokens.json')
  },
  {
    folder: 'patch user by admin',
    iterationData: require('./testData/user/patch-user-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch user by user',
    iterationData: require('./testData/user/patch-user-with-any-fields-by-user.json')
  },
  {
    folder: 'patch user with invalid request body',
    iterationData: require('./testData/user/patch-user-with-invalid-data.json')
  },
  {
    folder: 'patch user with all kinds of invalid token',
    iterationData: require('./testData/user/patch-user-with-invalid-tokens.json')
  },
  {
    folder: 'delete user by admin',
    iterationData: require('./testData/user/delete-user-by-admin.json')
  },
  {
    folder: 'delete user with all kinds of invalid token',
    iterationData: require('./testData/user/delete-user-with-invalid-tokens.json')
  },

  {
    folder: 'search skill providers with various parameters by admin',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'search skill providers with various parameters by user',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'search skill providers with invalid parameters',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-invalid-parameters.json')
  },
  {
    folder: 'search skill providers with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-invalid-tokens.json')
  },
  {
    folder: 'head skill providers with various parameters by admin',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'head skill providers with various parameters by user',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'head skill providers with invalid parameters',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-invalid-parameters.json')
  },
  {
    folder: 'head skill providers with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/search-skill-providers-with-invalid-tokens.json')
  },
  {
    folder: 'create skill provider by admin',
    iterationData: require('./testData/skill-provider/create-skill-provider-by-admin.json')
  },
  {
    folder: 'create skill provider by user',
    iterationData: require('./testData/skill-provider/create-skill-provider-by-user.json')
  },
  {
    folder: 'create skill provider with all kinds of invalid request body',
    iterationData: require('./testData/skill-provider/create-skill-provider-with-invalid-data.json')
  },
  {
    folder: 'create skill provider with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/create-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'get skill provider with various parameters by admin',
    iterationData: require('./testData/skill-provider/get-skill-provider-by-admin.json')
  },
  {
    folder: 'get skill provider with various parameters by user',
    iterationData: require('./testData/skill-provider/get-skill-provider-by-user.json')
  },
  {
    folder: 'get skill provider with invalid requests',
    iterationData: require('./testData/skill-provider/get-skill-provider-with-invalid-parameters.json')
  },
  {
    folder: 'get skill provider with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/get-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'head skill provider with various parameters by admin',
    iterationData: require('./testData/skill-provider/get-skill-provider-by-admin.json')
  },
  {
    folder: 'head skill provider with various parameters by user',
    iterationData: require('./testData/skill-provider/get-skill-provider-by-user.json')
  },
  {
    folder: 'head skill provider with invalid requests',
    iterationData: require('./testData/skill-provider/get-skill-provider-with-invalid-parameters.json')
  },
  {
    folder: 'head skill provider with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/get-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'patch skill provider by admin',
    iterationData: require('./testData/skill-provider/patch-skill-provider-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch skill provider by user',
    iterationData: require('./testData/skill-provider/patch-skill-provider-with-any-fields-by-user.json')
  },
  {
    folder: 'patch skill provider with invalid request body',
    iterationData: require('./testData/skill-provider/patch-skill-provider-with-invalid-data.json')
  },
  {
    folder: 'patch skill provider with all kinds of invalid token',
    iterationData: require('./testData/skill-provider/patch-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'delete skill provider by admin',
    iterationData: require('./testData/skill-provider/delete-skill-provider-by-admin.json')
  },
  {
    folder: 'delete skill provider with all kinds of invalid request',
    iterationData: require('./testData/skill-provider/delete-skill-provider-with-invalid-request.json')
  },

  {
    folder: 'search skills with various parameters by admin',
    iterationData: require('./testData/skill/search-skills-with-various-parameters.json')
  },
  {
    folder: 'search skills with various parameters by user',
    iterationData: require('./testData/skill/search-skills-with-various-parameters.json')
  },
  {
    folder: 'search skills with invalid parameters',
    iterationData: require('./testData/skill/search-skills-with-invalid-parameters.json')
  },
  {
    folder: 'search skills with all kinds of invalid token',
    iterationData: require('./testData/skill/search-skills-with-invalid-tokens.json')
  },
  {
    folder: 'head skills with various parameters by admin',
    iterationData: require('./testData/skill/search-skills-with-various-parameters.json')
  },
  {
    folder: 'head skills with various parameters by user',
    iterationData: require('./testData/skill/search-skills-with-various-parameters.json')
  },
  {
    folder: 'head skills with invalid parameters',
    iterationData: require('./testData/skill/search-skills-with-invalid-parameters.json')
  },
  {
    folder: 'head skills with all kinds of invalid token',
    iterationData: require('./testData/skill/search-skills-with-invalid-tokens.json')
  },
  {
    folder: 'create skill by admin',
    iterationData: require('./testData/skill/create-skill-by-admin.json')
  },
  {
    folder: 'create skill by user',
    iterationData: require('./testData/skill/create-skill-by-user.json')
  },
  {
    folder: 'create skill with all kinds of invalid request body',
    iterationData: require('./testData/skill/create-skill-with-invalid-data.json')
  },
  {
    folder: 'create skill with all kinds of invalid token',
    iterationData: require('./testData/skill/create-skill-with-invalid-tokens.json')
  },
  {
    folder: 'get skill with various parameters by admin',
    iterationData: require('./testData/skill/get-skill-by-admin.json')
  },
  {
    folder: 'get skill with various parameters by user',
    iterationData: require('./testData/skill/get-skill-by-user.json')
  },
  {
    folder: 'get skill with invalid requests',
    iterationData: require('./testData/skill/get-skill-with-invalid-parameters.json')
  },
  {
    folder: 'get skill with all kinds of invalid token',
    iterationData: require('./testData/skill/get-skill-with-invalid-tokens.json')
  },
  {
    folder: 'head skill with various parameters by admin',
    iterationData: require('./testData/skill/get-skill-by-admin.json')
  },
  {
    folder: 'head skill with various parameters by user',
    iterationData: require('./testData/skill/get-skill-by-user.json')
  },
  {
    folder: 'head skill with invalid requests',
    iterationData: require('./testData/skill/get-skill-with-invalid-parameters.json')
  },
  {
    folder: 'head skill with all kinds of invalid token',
    iterationData: require('./testData/skill/get-skill-with-invalid-tokens.json')
  },
  {
    folder: 'patch skill by admin',
    iterationData: require('./testData/skill/patch-skill-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch skill by user',
    iterationData: require('./testData/skill/patch-skill-with-any-fields-by-user.json')
  },
  {
    folder: 'patch skill with invalid request body',
    iterationData: require('./testData/skill/patch-skill-with-invalid-data.json')
  },
  {
    folder: 'patch skill with all kinds of invalid token',
    iterationData: require('./testData/skill/patch-skill-with-invalid-tokens.json')
  },
  {
    folder: 'delete skill by admin',
    iterationData: require('./testData/skill/delete-skill-by-admin.json')
  },
  {
    folder: 'delete skill with all kinds of invalid request',
    iterationData: require('./testData/skill/delete-skill-with-invalid-request.json')
  },

  {
    folder: 'search user skills with various parameters by admin',
    iterationData: require('./testData/user-skill/search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'search user skills with various parameters by user',
    iterationData: require('./testData/user-skill/search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'search user skills with invalid parameters',
    iterationData: require('./testData/user-skill/search-user-skills-with-invalid-parameters.json')
  },
  {
    folder: 'search user skills with all kinds of invalid token',
    iterationData: require('./testData/user-skill/search-user-skills-with-invalid-tokens.json')
  },
  {
    folder: 'head user skills with various parameters by admin',
    iterationData: require('./testData/user-skill/search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'head user skills with various parameters by user',
    iterationData: require('./testData/user-skill/search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'head user skills with invalid parameters',
    iterationData: require('./testData/user-skill/search-user-skills-with-invalid-parameters.json')
  },
  {
    folder: 'head user skills with all kinds of invalid token',
    iterationData: require('./testData/user-skill/search-user-skills-with-invalid-tokens.json')
  },
  {
    folder: 'create user skill by admin',
    iterationData: require('./testData/user-skill/create-user-skill-by-admin.json')
  },
  {
    folder: 'create user skill by user',
    iterationData: require('./testData/user-skill/create-user-skill-by-user.json')
  },
  {
    folder: 'create user skill with all kinds of invalid request body',
    iterationData: require('./testData/user-skill/create-user-skill-with-invalid-data.json')
  },
  {
    folder: 'create user skill with all kinds of invalid token',
    iterationData: require('./testData/user-skill/create-user-skill-with-invalid-tokens.json')
  },
  {
    folder: 'get user skill with various parameters by admin',
    iterationData: require('./testData/user-skill/get-user-skill-by-admin.json')
  },
  {
    folder: 'get user skill with various parameters by user',
    iterationData: require('./testData/user-skill/get-user-skill-by-user.json')
  },
  {
    folder: 'get user skill with invalid requests',
    iterationData: require('./testData/user-skill/get-user-skill-with-invalid-parameters.json')
  },
  {
    folder: 'get user skill with all kinds of invalid token',
    iterationData: require('./testData/user-skill/get-user-skill-with-invalid-tokens.json')
  },
  {
    folder: 'head user skill with various parameters by admin',
    iterationData: require('./testData/user-skill/get-user-skill-by-admin.json')
  },
  {
    folder: 'head user skill with various parameters by user',
    iterationData: require('./testData/user-skill/get-user-skill-by-user.json')
  },
  {
    folder: 'head user skill with invalid requests',
    iterationData: require('./testData/user-skill/get-user-skill-with-invalid-parameters.json')
  },
  {
    folder: 'head user skill with all kinds of invalid token',
    iterationData: require('./testData/user-skill/get-user-skill-with-invalid-tokens.json')
  },
  {
    folder: 'patch user skill by admin',
    iterationData: require('./testData/user-skill/patch-user-skill-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch user skill by user',
    iterationData: require('./testData/user-skill/patch-user-skill-with-any-fields-by-user.json')
  },
  {
    folder: 'patch user skill with invalid request body',
    iterationData: require('./testData/user-skill/patch-user-skill-with-invalid-data.json')
  },
  {
    folder: 'patch user skill with all kinds of invalid token',
    iterationData: require('./testData/user-skill/patch-user-skill-with-invalid-tokens.json')
  },
  {
    folder: 'delete user skill by admin'
  },
  {
    folder: 'delete user skill with all kinds of invalid request',
    iterationData: require('./testData/user-skill/delete-user-skill-with-invalid-request.json')
  },

  {
    folder: 'search roles with various parameters by admin',
    iterationData: require('./testData/role/search-roles-with-various-parameters.json')
  },
  {
    folder: 'search roles with various parameters by user',
    iterationData: require('./testData/role/search-roles-with-various-parameters.json')
  },
  {
    folder: 'search roles with invalid parameters',
    iterationData: require('./testData/role/search-roles-with-invalid-parameters.json')
  },
  {
    folder: 'search roles with all kinds of invalid token',
    iterationData: require('./testData/role/search-roles-with-invalid-tokens.json')
  },
  {
    folder: 'head roles with various parameters by admin',
    iterationData: require('./testData/role/search-roles-with-various-parameters.json')
  },
  {
    folder: 'head roles with various parameters by user',
    iterationData: require('./testData/role/search-roles-with-various-parameters.json')
  },
  {
    folder: 'head roles with invalid parameters',
    iterationData: require('./testData/role/search-roles-with-invalid-parameters.json')
  },
  {
    folder: 'head roles with all kinds of invalid token',
    iterationData: require('./testData/role/search-roles-with-invalid-tokens.json')
  },
  {
    folder: 'create role by admin',
    iterationData: require('./testData/role/create-role-by-admin.json')
  },
  {
    folder: 'create role by user',
    iterationData: require('./testData/role/create-role-by-user.json')
  },
  {
    folder: 'create role with all kinds of invalid request body',
    iterationData: require('./testData/role/create-role-with-invalid-data.json')
  },
  {
    folder: 'create role with all kinds of invalid token',
    iterationData: require('./testData/role/create-role-with-invalid-tokens.json')
  },
  {
    folder: 'get role with various parameters by admin',
    iterationData: require('./testData/role/get-role-by-admin.json')
  },
  {
    folder: 'get role with various parameters by user',
    iterationData: require('./testData/role/get-role-by-user.json')
  },
  {
    folder: 'get role with invalid requests',
    iterationData: require('./testData/role/get-role-with-invalid-parameters.json')
  },
  {
    folder: 'get role with all kinds of invalid token',
    iterationData: require('./testData/role/get-role-with-invalid-tokens.json')
  },
  {
    folder: 'head role with various parameters by admin',
    iterationData: require('./testData/role/get-role-by-admin.json')
  },
  {
    folder: 'head role with various parameters by user',
    iterationData: require('./testData/role/get-role-by-user.json')
  },
  {
    folder: 'head role with invalid requests',
    iterationData: require('./testData/role/get-role-with-invalid-parameters.json')
  },
  {
    folder: 'head role with all kinds of invalid token',
    iterationData: require('./testData/role/get-role-with-invalid-tokens.json')
  },
  {
    folder: 'patch role by admin',
    iterationData: require('./testData/role/patch-role-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch role by user',
    iterationData: require('./testData/role/patch-role-with-any-fields-by-user.json')
  },
  {
    folder: 'patch role with invalid request body',
    iterationData: require('./testData/role/patch-role-with-invalid-data.json')
  },
  {
    folder: 'patch role with all kinds of invalid token',
    iterationData: require('./testData/role/patch-role-with-invalid-tokens.json')
  },
  {
    folder: 'delete role by admin',
    iterationData: require('./testData/role/delete-role-by-admin.json')
  },
  {
    folder: 'delete role with all kinds of invalid request',
    iterationData: require('./testData/role/delete-role-with-invalid-request.json')
  },

  {
    folder: 'search user roles with various parameters by admin',
    iterationData: require('./testData/user-role/search-user-roles-with-various-parameters.json')
  },
  {
    folder: 'search user roles with various parameters by user',
    iterationData: require('./testData/user-role/search-user-roles-with-various-parameters.json')
  },
  {
    folder: 'search user roles with invalid parameters',
    iterationData: require('./testData/user-role/search-user-roles-with-invalid-parameters.json')
  },
  {
    folder: 'search user roles with all kinds of invalid token',
    iterationData: require('./testData/user-role/search-user-roles-with-invalid-tokens.json')
  },
  {
    folder: 'head user roles with various parameters by admin',
    iterationData: require('./testData/user-role/search-user-roles-with-various-parameters.json')
  },
  {
    folder: 'head user roles with various parameters by user',
    iterationData: require('./testData/user-role/search-user-roles-with-various-parameters.json')
  },
  {
    folder: 'head user roles with invalid parameters',
    iterationData: require('./testData/user-role/search-user-roles-with-invalid-parameters.json')
  },
  {
    folder: 'head user roles with all kinds of invalid token',
    iterationData: require('./testData/user-role/search-user-roles-with-invalid-tokens.json')
  },
  {
    folder: 'create user role by admin',
    iterationData: require('./testData/user-role/create-user-role-by-admin.json')
  },
  {
    folder: 'create user role by user',
    iterationData: require('./testData/user-role/create-user-role-by-user.json')
  },
  {
    folder: 'create user role with all kinds of invalid request body',
    iterationData: require('./testData/user-role/create-user-role-with-invalid-data.json')
  },
  {
    folder: 'create user role with all kinds of invalid token',
    iterationData: require('./testData/user-role/create-user-role-with-invalid-tokens.json')
  },
  {
    folder: 'get user role with various parameters by admin',
    iterationData: require('./testData/user-role/get-user-role-by-admin.json')
  },
  {
    folder: 'get user role with various parameters by user',
    iterationData: require('./testData/user-role/get-user-role-by-user.json')
  },
  {
    folder: 'get user role with invalid requests',
    iterationData: require('./testData/user-role/get-user-role-with-invalid-parameters.json')
  },
  {
    folder: 'get user role with all kinds of invalid token',
    iterationData: require('./testData/user-role/get-user-role-with-invalid-tokens.json')
  },
  {
    folder: 'head user role with various parameters by admin',
    iterationData: require('./testData/user-role/get-user-role-by-admin.json')
  },
  {
    folder: 'head user role with various parameters by user',
    iterationData: require('./testData/user-role/get-user-role-by-user.json')
  },
  {
    folder: 'head user role with invalid requests',
    iterationData: require('./testData/user-role/get-user-role-with-invalid-parameters.json')
  },
  {
    folder: 'head user role with all kinds of invalid token',
    iterationData: require('./testData/user-role/get-user-role-with-invalid-tokens.json')
  },
  {
    folder: 'delete user role by admin'
  },
  {
    folder: 'delete user role with all kinds of invalid request',
    iterationData: require('./testData/user-role/delete-user-role-with-invalid-request.json')
  },

  {
    folder: 'search organizations with various parameters by admin',
    iterationData: require('./testData/organization/search-organizations-with-various-parameters.json')
  },
  {
    folder: 'search organizations with various parameters by user',
    iterationData: require('./testData/organization/search-organizations-with-various-parameters.json')
  },
  {
    folder: 'search organizations with invalid parameters',
    iterationData: require('./testData/organization/search-organizations-with-invalid-parameters.json')
  },
  {
    folder: 'search organizations with all kinds of invalid token',
    iterationData: require('./testData/organization/search-organizations-with-invalid-tokens.json')
  },
  {
    folder: 'head organizations with various parameters by admin',
    iterationData: require('./testData/organization/search-organizations-with-various-parameters.json')
  },
  {
    folder: 'head organizations with various parameters by user',
    iterationData: require('./testData/organization/search-organizations-with-various-parameters.json')
  },
  {
    folder: 'head organizations with invalid parameters',
    iterationData: require('./testData/organization/search-organizations-with-invalid-parameters.json')
  },
  {
    folder: 'head organizations with all kinds of invalid token',
    iterationData: require('./testData/organization/search-organizations-with-invalid-tokens.json')
  },
  {
    folder: 'create organization by admin',
    iterationData: require('./testData/organization/create-organization-by-admin.json')
  },
  {
    folder: 'create organization by user',
    iterationData: require('./testData/organization/create-organization-by-user.json')
  },
  {
    folder: 'create organization with all kinds of invalid request body',
    iterationData: require('./testData/organization/create-organization-with-invalid-data.json')
  },
  {
    folder: 'create organization with all kinds of invalid token',
    iterationData: require('./testData/organization/create-organization-with-invalid-tokens.json')
  },
  {
    folder: 'get organization with various parameters by admin',
    iterationData: require('./testData/organization/get-organization-by-admin.json')
  },
  {
    folder: 'get organization with various parameters by user',
    iterationData: require('./testData/organization/get-organization-by-user.json')
  },
  {
    folder: 'get organization with invalid requests',
    iterationData: require('./testData/organization/get-organization-with-invalid-parameters.json')
  },
  {
    folder: 'get organization with all kinds of invalid token',
    iterationData: require('./testData/organization/get-organization-with-invalid-tokens.json')
  },
  {
    folder: 'head organization with various parameters by admin',
    iterationData: require('./testData/organization/get-organization-by-admin.json')
  },
  {
    folder: 'head organization with various parameters by user',
    iterationData: require('./testData/organization/get-organization-by-user.json')
  },
  {
    folder: 'head organization with invalid requests',
    iterationData: require('./testData/organization/get-organization-with-invalid-parameters.json')
  },
  {
    folder: 'head organization with all kinds of invalid token',
    iterationData: require('./testData/organization/get-organization-with-invalid-tokens.json')
  },
  {
    folder: 'patch organization by admin',
    iterationData: require('./testData/organization/patch-organization-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch organization by user',
    iterationData: require('./testData/organization/patch-organization-with-any-fields-by-user.json')
  },
  {
    folder: 'patch organization with invalid request body',
    iterationData: require('./testData/organization/patch-organization-with-invalid-data.json')
  },
  {
    folder: 'patch organization with all kinds of invalid token',
    iterationData: require('./testData/organization/patch-organization-with-invalid-tokens.json')
  },
  {
    folder: 'delete organization by admin'
  },
  {
    folder: 'delete organization with all kinds of invalid request',
    iterationData: require('./testData/organization/delete-organization-with-invalid-request.json')
  },

  {
    folder: 'search achievementsProviders with various parameters by admin',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-various-parameters.json')
  },
  {
    folder: 'search achievementsProviders with various parameters by user',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-various-parameters.json')
  },
  {
    folder: 'search achievementsProviders with invalid parameters',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-invalid-parameters.json')
  },
  {
    folder: 'search achievementsProviders with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-invalid-tokens.json')
  },
  {
    folder: 'head achievementsProviders with various parameters by admin',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-various-parameters.json')
  },
  {
    folder: 'head achievementsProviders with various parameters by user',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-various-parameters.json')
  },
  {
    folder: 'head achievementsProviders with invalid parameters',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-invalid-parameters.json')
  },
  {
    folder: 'head achievementsProviders with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/search-achievements-providers-with-invalid-tokens.json')
  },
  {
    folder: 'create achievementsProvider by admin',
    iterationData: require('./testData/achievements-provider/create-achievements-provider-by-admin.json')
  },
  {
    folder: 'create achievementsProvider by user',
    iterationData: require('./testData/achievements-provider/create-achievements-provider-by-user.json')
  },
  {
    folder: 'create achievementsProvider with all kinds of invalid request body',
    iterationData: require('./testData/achievements-provider/create-achievements-provider-with-invalid-data.json')
  },
  {
    folder: 'create achievementsProvider with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/create-achievements-provider-with-invalid-tokens.json')
  },
  {
    folder: 'get achievementsProvider with various parameters by admin',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-by-admin.json')
  },
  {
    folder: 'get achievementsProvider with various parameters by user',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-by-user.json')
  },
  {
    folder: 'get achievementsProvider with invalid requests',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-with-invalid-parameters.json')
  },
  {
    folder: 'get achievementsProvider with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-with-invalid-tokens.json')
  },
  {
    folder: 'head achievementsProvider with various parameters by admin',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-by-admin.json')
  },
  {
    folder: 'head achievementsProvider with various parameters by user',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-by-user.json')
  },
  {
    folder: 'head achievementsProvider with invalid requests',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-with-invalid-parameters.json')
  },
  {
    folder: 'head achievementsProvider with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/get-achievements-provider-with-invalid-tokens.json')
  },
  {
    folder: 'patch achievementsProvider by admin',
    iterationData: require('./testData/achievements-provider/patch-achievements-provider-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch achievementsProvider by user',
    iterationData: require('./testData/achievements-provider/patch-achievements-provider-with-any-fields-by-user.json')
  },
  {
    folder: 'patch achievementsProvider with invalid request body',
    iterationData: require('./testData/achievements-provider/patch-achievements-provider-with-invalid-data.json')
  },
  {
    folder: 'patch achievementsProvider with all kinds of invalid token',
    iterationData: require('./testData/achievements-provider/patch-achievements-provider-with-invalid-tokens.json')
  },
  {
    folder: 'delete achievementsProvider by admin'
  },
  {
    folder: 'delete achievementsProvider with all kinds of invalid request',
    iterationData: require('./testData/achievements-provider/delete-achievements-provider-with-invalid-request.json')
  },

  {
    folder: 'search attributeGroups with various parameters by admin',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-various-parameters.json')
  },
  {
    folder: 'search attributeGroups with various parameters by user',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-various-parameters.json')
  },
  {
    folder: 'search attributeGroups with invalid parameters',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-invalid-parameters.json')
  },
  {
    folder: 'search attributeGroups with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-invalid-tokens.json')
  },
  {
    folder: 'head attributeGroups with various parameters by admin',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-various-parameters.json')
  },
  {
    folder: 'head attributeGroups with various parameters by user',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-various-parameters.json')
  },
  {
    folder: 'head attributeGroups with invalid parameters',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-invalid-parameters.json')
  },
  {
    folder: 'head attributeGroups with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/search-attribute-groups-with-invalid-tokens.json')
  },
  {
    folder: 'create attributeGroup by admin',
    iterationData: require('./testData/attribute-group/create-attribute-group-by-admin.json')
  },
  {
    folder: 'create attributeGroup by user',
    iterationData: require('./testData/attribute-group/create-attribute-group-by-user.json')
  },
  {
    folder: 'create attributeGroup with all kinds of invalid request body',
    iterationData: require('./testData/attribute-group/create-attribute-group-with-invalid-data.json')
  },
  {
    folder: 'create attributeGroup with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/create-attribute-group-with-invalid-tokens.json')
  },
  {
    folder: 'get attributeGroup with various parameters by admin',
    iterationData: require('./testData/attribute-group/get-attribute-group-by-admin.json')
  },
  {
    folder: 'get attributeGroup with various parameters by user',
    iterationData: require('./testData/attribute-group/get-attribute-group-by-user.json')
  },
  {
    folder: 'get attributeGroup with invalid requests',
    iterationData: require('./testData/attribute-group/get-attribute-group-with-invalid-parameters.json')
  },
  {
    folder: 'get attributeGroup with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/get-attribute-group-with-invalid-tokens.json')
  },
  {
    folder: 'head attributeGroup with various parameters by admin',
    iterationData: require('./testData/attribute-group/get-attribute-group-by-admin.json')
  },
  {
    folder: 'head attributeGroup with various parameters by user',
    iterationData: require('./testData/attribute-group/get-attribute-group-by-user.json')
  },
  {
    folder: 'head attributeGroup with invalid requests',
    iterationData: require('./testData/attribute-group/get-attribute-group-with-invalid-parameters.json')
  },
  {
    folder: 'head attributeGroup with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/get-attribute-group-with-invalid-tokens.json')
  },
  {
    folder: 'patch attributeGroup by admin',
    iterationData: require('./testData/attribute-group/patch-attribute-group-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch attributeGroup by user',
    iterationData: require('./testData/attribute-group/patch-attribute-group-with-any-fields-by-user.json')
  },
  {
    folder: 'patch attributeGroup with invalid request body',
    iterationData: require('./testData/attribute-group/patch-attribute-group-with-invalid-data.json')
  },
  {
    folder: 'patch attributeGroup with all kinds of invalid token',
    iterationData: require('./testData/attribute-group/patch-attribute-group-with-invalid-tokens.json')
  },
  {
    folder: 'delete attributeGroup by admin'
  },
  {
    folder: 'delete attributeGroup with all kinds of invalid request',
    iterationData: require('./testData/attribute-group/delete-attribute-group-with-invalid-request.json')
  },

  {
    folder: 'search attributes with various parameters by admin',
    iterationData: require('./testData/attribute/search-attributes-with-various-parameters.json')
  },
  {
    folder: 'search attributes with various parameters by user',
    iterationData: require('./testData/attribute/search-attributes-with-various-parameters.json')
  },
  {
    folder: 'search attributes with invalid parameters',
    iterationData: require('./testData/attribute/search-attributes-with-invalid-parameters.json')
  },
  {
    folder: 'search attributes with all kinds of invalid token',
    iterationData: require('./testData/attribute/search-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'head attributes with various parameters by admin',
    iterationData: require('./testData/attribute/search-attributes-with-various-parameters.json')
  },
  {
    folder: 'head attributes with various parameters by user',
    iterationData: require('./testData/attribute/search-attributes-with-various-parameters.json')
  },
  {
    folder: 'head attributes with invalid parameters',
    iterationData: require('./testData/attribute/search-attributes-with-invalid-parameters.json')
  },
  {
    folder: 'head attributes with all kinds of invalid token',
    iterationData: require('./testData/attribute/search-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'create attribute by admin',
    iterationData: require('./testData/attribute/create-attribute-by-admin.json')
  },
  {
    folder: 'create attribute by user',
    iterationData: require('./testData/attribute/create-attribute-by-user.json')
  },
  {
    folder: 'create attribute with all kinds of invalid request body',
    iterationData: require('./testData/attribute/create-attribute-with-invalid-data.json')
  },
  {
    folder: 'create attribute with all kinds of invalid token',
    iterationData: require('./testData/attribute/create-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'get attribute with various parameters by admin',
    iterationData: require('./testData/attribute/get-attribute-by-admin.json')
  },
  {
    folder: 'get attribute with various parameters by user',
    iterationData: require('./testData/attribute/get-attribute-by-user.json')
  },
  {
    folder: 'get attribute with invalid requests',
    iterationData: require('./testData/attribute/get-attribute-with-invalid-parameters.json')
  },
  {
    folder: 'get attribute with all kinds of invalid token',
    iterationData: require('./testData/attribute/get-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'head attribute with various parameters by admin',
    iterationData: require('./testData/attribute/get-attribute-by-admin.json')
  },
  {
    folder: 'head attribute with various parameters by user',
    iterationData: require('./testData/attribute/get-attribute-by-user.json')
  },
  {
    folder: 'head attribute with invalid requests',
    iterationData: require('./testData/attribute/get-attribute-with-invalid-parameters.json')
  },
  {
    folder: 'head attribute with all kinds of invalid token',
    iterationData: require('./testData/attribute/get-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'patch attribute by admin',
    iterationData: require('./testData/attribute/patch-attribute-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch attribute by user',
    iterationData: require('./testData/attribute/patch-attribute-with-any-fields-by-user.json')
  },
  {
    folder: 'patch attribute with invalid request body',
    iterationData: require('./testData/attribute/patch-attribute-with-invalid-data.json')
  },
  {
    folder: 'patch attribute with all kinds of invalid token',
    iterationData: require('./testData/attribute/patch-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'delete attribute by admin'
  },
  {
    folder: 'delete attribute with all kinds of invalid request',
    iterationData: require('./testData/attribute/delete-attribute-with-invalid-request.json')
  },

  {
    folder: 'search user achievements with various parameters by admin',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'search user achievements with various parameters by user',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'search user achievements with invalid parameters',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-invalid-parameters.json')
  },
  {
    folder: 'search user achievements with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-invalid-tokens.json')
  },
  {
    folder: 'head user achievements with various parameters by admin',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'head user achievements with various parameters by user',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'head user achievements with invalid parameters',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-invalid-parameters.json')
  },
  {
    folder: 'head user achievements with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/search-user-achievements-with-invalid-tokens.json')
  },
  {
    folder: 'create user achievement by admin',
    iterationData: require('./testData/user-achievement/create-user-achievement-by-admin.json')
  },
  {
    folder: 'create user achievement by user',
    iterationData: require('./testData/user-achievement/create-user-achievement-by-user.json')
  },
  {
    folder: 'create user achievement with all kinds of invalid request body',
    iterationData: require('./testData/user-achievement/create-user-achievement-with-invalid-data.json')
  },
  {
    folder: 'create user achievement with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/create-user-achievement-with-invalid-tokens.json')
  },
  {
    folder: 'get user achievement with various parameters by admin',
    iterationData: require('./testData/user-achievement/get-user-achievement-by-admin.json')
  },
  {
    folder: 'get user achievement with various parameters by user',
    iterationData: require('./testData/user-achievement/get-user-achievement-by-user.json')
  },
  {
    folder: 'get user achievement with invalid requests',
    iterationData: require('./testData/user-achievement/get-user-achievement-with-invalid-parameters.json')
  },
  {
    folder: 'get user achievement with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/get-user-achievement-with-invalid-tokens.json')
  },
  {
    folder: 'head user achievement with various parameters by admin',
    iterationData: require('./testData/user-achievement/get-user-achievement-by-admin.json')
  },
  {
    folder: 'head user achievement with various parameters by user',
    iterationData: require('./testData/user-achievement/get-user-achievement-by-user.json')
  },
  {
    folder: 'head user achievement with invalid requests',
    iterationData: require('./testData/user-achievement/get-user-achievement-with-invalid-parameters.json')
  },
  {
    folder: 'head user achievement with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/get-user-achievement-with-invalid-tokens.json')
  },
  {
    folder: 'patch user achievement by admin',
    iterationData: require('./testData/user-achievement/patch-user-achievement-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch user achievement by user',
    iterationData: require('./testData/user-achievement/patch-user-achievement-with-any-fields-by-user.json')
  },
  {
    folder: 'patch user achievement with invalid request body',
    iterationData: require('./testData/user-achievement/patch-user-achievement-with-invalid-data.json')
  },
  {
    folder: 'patch user achievement with all kinds of invalid token',
    iterationData: require('./testData/user-achievement/patch-user-achievement-with-invalid-tokens.json')
  },
  {
    folder: 'delete user achievement by admin',
    iterationData: require('./testData/user-achievement/delete-user-achievement-by-admin.json')
  },
  {
    folder: 'delete user achievement with all kinds of invalid request',
    iterationData: require('./testData/user-achievement/delete-user-achievement-with-invalid-request.json')
  },

  {
    folder: 'search organization skillProviders with various parameters by admin',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'search organization skillProviders with various parameters by user',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'search organization skillProviders with invalid parameters',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-invalid-parameters.json')
  },
  {
    folder: 'search organization skillProviders with all kinds of invalid token',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-invalid-tokens.json')
  },
  {
    folder: 'head organization skillProviders with various parameters by admin',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'head organization skillProviders with various parameters by user',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-various-parameters.json')
  },
  {
    folder: 'head organization skillProviders with invalid parameters',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-invalid-parameters.json')
  },
  {
    folder: 'head organization skillProviders with all kinds of invalid token',
    iterationData: require('./testData/organization-skill-provider/search-organization-skill-providers-with-invalid-tokens.json')
  },
  {
    folder: 'create organization skillProvider by admin',
    iterationData: require('./testData/organization-skill-provider/create-organization-skill-provider-by-admin.json')
  },
  {
    folder: 'create organization skillProvider by user',
    iterationData: require('./testData/organization-skill-provider/create-organization-skill-provider-by-user.json')
  },
  {
    folder: 'create organization skillProvider with all kinds of invalid request body',
    iterationData: require('./testData/organization-skill-provider/create-organization-skill-provider-with-invalid-data.json')
  },
  {
    folder: 'create organization skillProvider with all kinds of invalid token',
    iterationData: require('./testData/organization-skill-provider/create-organization-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'get organization skillProvider with various parameters by admin',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-by-admin.json')
  },
  {
    folder: 'get organization skillProvider with various parameters by user',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-by-user.json')
  },
  {
    folder: 'get organization skillProvider with invalid requests',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-with-invalid-parameters.json')
  },
  {
    folder: 'get organization skillProvider with all kinds of invalid token',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'head organization skillProvider with various parameters by admin',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-by-admin.json')
  },
  {
    folder: 'head organization skillProvider with various parameters by user',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-by-user.json')
  },
  {
    folder: 'head organization skillProvider with invalid requests',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-with-invalid-parameters.json')
  },
  {
    folder: 'head organization skillProvider with all kinds of invalid token',
    iterationData: require('./testData/organization-skill-provider/get-organization-skill-provider-with-invalid-tokens.json')
  },
  {
    folder: 'delete organization skillProvider by admin',
    iterationData: require('./testData/organization-skill-provider/delete-organization-skill-provider-by-admin.json')
  },
  {
    folder: 'delete organization skillProvider with all kinds of invalid request',
    iterationData: require('./testData/organization-skill-provider/delete-organization-skill-provider-with-invalid-request.json')
  },

  {
    folder: 'search user externalProfiles with various parameters by admin',
    iterationData: require('./testData/external-profile/search-external-profiles-with-various-parameters.json')
  },
  {
    folder: 'search user externalProfiles with various parameters by user',
    iterationData: require('./testData/external-profile/search-external-profiles-with-various-parameters.json')
  },
  {
    folder: 'search user externalProfiles with invalid parameters',
    iterationData: require('./testData/external-profile/search-external-profiles-with-invalid-parameters.json')
  },
  {
    folder: 'search user externalProfiles with all kinds of invalid token',
    iterationData: require('./testData/external-profile/search-external-profiles-with-invalid-tokens.json')
  },
  {
    folder: 'head user externalProfiles with various parameters by admin',
    iterationData: require('./testData/external-profile/search-external-profiles-with-various-parameters.json')
  },
  {
    folder: 'head user externalProfiles with various parameters by user',
    iterationData: require('./testData/external-profile/search-external-profiles-with-various-parameters.json')
  },
  {
    folder: 'head user externalProfiles with invalid parameters',
    iterationData: require('./testData/external-profile/search-external-profiles-with-invalid-parameters.json')
  },
  {
    folder: 'head user externalProfiles with all kinds of invalid token',
    iterationData: require('./testData/external-profile/search-external-profiles-with-invalid-tokens.json')
  },
  {
    folder: 'create user externalProfile by admin',
    iterationData: require('./testData/external-profile/create-external-profile-by-admin.json')
  },
  {
    folder: 'create user externalProfile by user',
    iterationData: require('./testData/external-profile/create-external-profile-by-user.json')
  },
  {
    folder: 'create user externalProfile with all kinds of invalid request body',
    iterationData: require('./testData/external-profile/create-external-profile-with-invalid-data.json')
  },
  {
    folder: 'create user externalProfile with all kinds of invalid token',
    iterationData: require('./testData/external-profile/create-external-profile-with-invalid-tokens.json')
  },
  {
    folder: 'get user externalProfile with various parameters by admin',
    iterationData: require('./testData/external-profile/get-external-profile-by-admin.json')
  },
  {
    folder: 'get user externalProfile with various parameters by user',
    iterationData: require('./testData/external-profile/get-external-profile-by-user.json')
  },
  {
    folder: 'get user externalProfile with invalid requests',
    iterationData: require('./testData/external-profile/get-external-profile-with-invalid-parameters.json')
  },
  {
    folder: 'get user externalProfile with all kinds of invalid token',
    iterationData: require('./testData/external-profile/get-external-profile-with-invalid-tokens.json')
  },
  {
    folder: 'head user externalProfile with various parameters by admin',
    iterationData: require('./testData/external-profile/get-external-profile-by-admin.json')
  },
  {
    folder: 'head user externalProfile with various parameters by user',
    iterationData: require('./testData/external-profile/get-external-profile-by-user.json')
  },
  {
    folder: 'head user externalProfile with invalid requests',
    iterationData: require('./testData/external-profile/get-external-profile-with-invalid-parameters.json')
  },
  {
    folder: 'head user externalProfile with all kinds of invalid token',
    iterationData: require('./testData/external-profile/get-external-profile-with-invalid-tokens.json')
  },
  {
    folder: 'patch user externalProfile by admin',
    iterationData: require('./testData/external-profile/patch-external-profile-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch user externalProfile by user',
    iterationData: require('./testData/external-profile/patch-external-profile-with-any-fields-by-user.json')
  },
  {
    folder: 'patch user externalProfile with invalid request body',
    iterationData: require('./testData/external-profile/patch-external-profile-with-invalid-data.json')
  },
  {
    folder: 'patch user externalProfile with all kinds of invalid token',
    iterationData: require('./testData/external-profile/patch-external-profile-with-invalid-tokens.json')
  },
  {
    folder: 'delete user externalProfile by admin',
    iterationData: require('./testData/external-profile/delete-external-profile-by-admin.json')
  },
  {
    folder: 'delete user externalProfile with all kinds of invalid request',
    iterationData: require('./testData/external-profile/delete-external-profile-with-invalid-request.json')
  },

  {
    folder: 'search user attributes with various parameters by admin',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'search user attributes with various parameters by user',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'search user attributes with invalid parameters',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-invalid-parameters.json')
  },
  {
    folder: 'search user attributes with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'head user attributes with various parameters by admin',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'head user attributes with various parameters by user',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'head user attributes with invalid parameters',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-invalid-parameters.json')
  },
  {
    folder: 'head user attributes with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/search-user-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'create user attribute by admin',
    iterationData: require('./testData/user-attribute/create-user-attribute-by-admin.json')
  },
  {
    folder: 'create user attribute by user',
    iterationData: require('./testData/user-attribute/create-user-attribute-by-user.json')
  },
  {
    folder: 'create user attribute with all kinds of invalid request body',
    iterationData: require('./testData/user-attribute/create-user-attribute-with-invalid-data.json')
  },
  {
    folder: 'create user attribute with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/create-user-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'get user attribute with various parameters by admin',
    iterationData: require('./testData/user-attribute/get-user-attribute-by-admin.json')
  },
  {
    folder: 'get user attribute with various parameters by user',
    iterationData: require('./testData/user-attribute/get-user-attribute-by-user.json')
  },
  {
    folder: 'get user attribute with invalid requests',
    iterationData: require('./testData/user-attribute/get-user-attribute-with-invalid-parameters.json')
  },
  {
    folder: 'get user attribute with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/get-user-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'head user attribute with various parameters by admin',
    iterationData: require('./testData/user-attribute/get-user-attribute-by-admin.json')
  },
  {
    folder: 'head user attribute with various parameters by user',
    iterationData: require('./testData/user-attribute/get-user-attribute-by-user.json')
  },
  {
    folder: 'head user attribute with invalid requests',
    iterationData: require('./testData/user-attribute/get-user-attribute-with-invalid-parameters.json')
  },
  {
    folder: 'head user attribute with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/get-user-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'patch user attribute by admin',
    iterationData: require('./testData/user-attribute/patch-user-attribute-with-any-fields-by-admin.json')
  },
  {
    folder: 'patch user attribute by user',
    iterationData: require('./testData/user-attribute/patch-user-attribute-with-any-fields-by-user.json')
  },
  {
    folder: 'patch user attribute with invalid request body',
    iterationData: require('./testData/user-attribute/patch-user-attribute-with-invalid-data.json')
  },
  {
    folder: 'patch user attribute with all kinds of invalid token',
    iterationData: require('./testData/user-attribute/patch-user-attribute-with-invalid-tokens.json')
  },
  {
    folder: 'delete user attribute by admin',
    iterationData: require('./testData/user-attribute/delete-user-attribute-by-admin.json')
  },
  {
    folder: 'delete user attribute with all kinds of invalid request',
    iterationData: require('./testData/user-attribute/delete-user-attribute-with-invalid-request.json')
  },
  {
    folder: 'skill search users with various parameters',
    iterationData: require('./testData/skill-search/skill-search-users-with-various-parameters.json')
  },
  {
    folder: 'skill search users with invalid request data',
    iterationData: require('./testData/skill-search/skill-search-users-with-invalid-parameters.json')
  },
  {
    folder: 'skill search users with invalid token',
    iterationData: require('./testData/skill-search/skill-search-users-with-invalid-tokens.json')
  },
  {
    folder: 'skill search user attributes with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'skill search user attributes with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'skill search head user attributes with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-attributes-with-various-parameters.json')
  },
  {
    folder: 'skill search head user attributes with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-attributes-with-invalid-tokens.json')
  },
  {
    folder: 'skill search user achievements with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'skill search user achievements with invalid request data',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-invalid-parameters.json')
  },
  {
    folder: 'skill search user achievements with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-invalid-tokens.json')
  },
  {
    folder: 'skill head user achievements with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-various-parameters.json')
  },
  {
    folder: 'skill head user achievements with invalid request data',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-invalid-parameters.json')
  },
  {
    folder: 'skill head user achievements with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-achievements-with-invalid-tokens.json')
  },
  {
    folder: 'skill search user skills with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'skill search user skills with invalid request data',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-invalid-parameters.json')
  },
  {
    folder: 'skill search user skills with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-invalid-tokens.json')
  },
  {
    folder: 'skill head user skills with various parameters',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-various-parameters.json')
  },
  {
    folder: 'skill head user skills with invalid request data',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-invalid-parameters.json')
  },
  {
    folder: 'skill head user skills with all kinds of invalid token',
    iterationData: require('./testData/skill-search/skill-search-user-skills-with-invalid-tokens.json')
  },
  {
    folder: 'health'
  }
]

/**
 * Clear the test data.
 * @return {Promise<void>}
 */
async function clearTestData () {
  logger.info('Clear the Postman test data.')
  await envHelper.postRequest(`${config.API_BASE_URL}/ubahn/internal/jobs/clean`)
  logger.info('Finished clear the Postman test data.')
}

/**
 * Run the postman tests.
 */
apiTestLib.runTests(requests, require.resolve('././Ubahn-api.postman_collection.json'),
  require.resolve('./Ubahn-api.postman_environment.json')).then(async () => {
  logger.info('newman test completed!')
  await clearTestData()
}).catch(async (err) => {
  logger.logFullError(err)

  // Only calling the clean up function when it is not validation error.
  if (err.name !== 'ValidationError') {
    await clearTestData()
  }
})
