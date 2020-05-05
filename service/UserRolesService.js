'use strict';


/**
 * Get User Roles that belong to given user id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * returns List
 **/
exports.usersUserIdRolesGET = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get User Roles that belong to given user id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * no response value expected for this operation
 **/
exports.usersUserIdRolesHEAD = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new User Role.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * userId String The user id
 * body UserRoleRequestBody 
 * returns UserRole
 **/
exports.usersUserIdRolesPOST = function(userId,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove an existing user role with given user and role id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * roleId String The role id
 * no response value expected for this operation
 **/
exports.usersUserIdRolesRoleIdDELETE = function(userId,roleId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get role by its id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * roleId String The role id
 * returns List
 **/
exports.usersUserIdRolesRoleIdGET = function(userId,roleId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve header information for a search operation on User Roles in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * roleId String The role id
 * no response value expected for this operation
 **/
exports.usersUserIdRolesRoleIdHEAD = function(userId,roleId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

