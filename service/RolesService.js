'use strict';


/**
 * Search Roles in the application.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by role name (optional)
 * returns List
 **/
exports.rolesGET = function(name) {
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
 * Retrieve header information for a search operation on Roles in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by role name (optional)
 * no response value expected for this operation
 **/
exports.rolesHEAD = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Role.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body NameRequestBody 
 * returns Role
 **/
exports.rolesPOST = function(body) {
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
 * Remove an existing role with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * roleId String The role id
 * no response value expected for this operation
 **/
exports.rolesRoleIdDELETE = function(roleId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get role with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * roleId String The role id
 * returns Role
 **/
exports.rolesRoleIdGET = function(roleId) {
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
 * Get role with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * roleId String The role id
 * no response value expected for this operation
 **/
exports.rolesRoleIdHEAD = function(roleId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing role with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * roleId String The role id
 * body NameRequestBody 
 * returns Role
 **/
exports.rolesRoleIdPATCH = function(roleId,body) {
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

