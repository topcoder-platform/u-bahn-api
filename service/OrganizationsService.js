'use strict';


/**
 * Search organizations in the application.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by organization name (optional)
 * returns List
 **/
exports.organizationsGET = function(name) {
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
 * Retrieve header information for a search operation on organizations in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by organization name (optional)
 * no response value expected for this operation
 **/
exports.organizationsHEAD = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Remove an existing organization with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * organizationId String The organization id
 * no response value expected for this operation
 **/
exports.organizationsOrganizationIdDELETE = function(organizationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get organization with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * organizationId String The organization id
 * returns Organization
 **/
exports.organizationsOrganizationIdGET = function(organizationId) {
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
 * Get organization with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * organizationId String The organization id
 * no response value expected for this operation
 **/
exports.organizationsOrganizationIdHEAD = function(organizationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing organization with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * organizationId String The organization id
 * body NameRequestBody 
 * returns Organization
 **/
exports.organizationsOrganizationIdPATCH = function(organizationId,body) {
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
 * Create a new Organization.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body NameRequestBody 
 * returns Organization
 **/
exports.organizationsPOST = function(body) {
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

