'use strict';


/**
 * Get External Profiles with given user id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * organizationName String The organization name (optional)
 * returns List
 **/
exports.usersUserIdExternalProfilesGET = function(userId,organizationName) {
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
 * Get External Profiles with given user id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * no response value expected for this operation
 **/
exports.usersUserIdExternalProfilesHEAD = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Remove an existing external profile with given user id and organization id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * organizationId String The organization id
 * no response value expected for this operation
 **/
exports.usersUserIdExternalProfilesOrganizationIdDELETE = function(userId,organizationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get external profile with given user id and organization id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * organizationId String The organization id
 * returns ExternalProfile
 **/
exports.usersUserIdExternalProfilesOrganizationIdGET = function(userId,organizationId) {
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
 * Get external profile with given user id and organization id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * organizationId String The organization id
 * no response value expected for this operation
 **/
exports.usersUserIdExternalProfilesOrganizationIdHEAD = function(userId,organizationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing external profile with given user id and organization id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * userId String The user id
 * organizationId String The organization id
 * body ExternalProfileUpdateRequestBody 
 * returns ExternalProfile
 **/
exports.usersUserIdExternalProfilesOrganizationIdPATCH = function(userId,organizationId,body) {
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
 * Create a new External Profile for given user id.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * userId String The user id
 * body ExternalProfileRequestBody 
 * returns ExternalProfile
 **/
exports.usersUserIdExternalProfilesPOST = function(userId,body) {
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

