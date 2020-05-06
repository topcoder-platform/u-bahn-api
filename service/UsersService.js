'use strict';


/**
 * **Point to note** - For non-admin users, this endpoint will only return entities that the user has created.
 *
 * handle String Filter by user handle (optional)
 * groupId String Filter by user group Id (optional)
 * roleId String Filter by user roleId (optional)
 * returns List
 **/
exports.usersGET = function(handle,groupId,roleId) {
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
 * Retrieve header information for a search operation on users in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * handle String Filter by user handle (optional)
 * groupId String Filter by user group Id (optional)
 * roleId String Filter by user roleId (optional)
 * no response value expected for this operation
 **/
exports.usersHEAD = function(handle,groupId,roleId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new User.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body UserRequestBody 
 * returns User
 **/
exports.usersPOST = function(body) {
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
 * Remove an existing User with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * no response value expected for this operation
 **/
exports.usersUserIdDELETE = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get User with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * returns User
 **/
exports.usersUserIdGET = function(userId) {
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
 * Get User with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * no response value expected for this operation
 **/
exports.usersUserIdHEAD = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing User with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * userId String The user id
 * body UserUpdateRequestBody 
 * returns User
 **/
exports.usersUserIdPATCH = function(userId,body) {
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

