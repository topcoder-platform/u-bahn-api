'use strict';


/**
 * Search Attribute Groups in the application.  Multiple filters are supported. If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by group name (optional)
 * organizationId String Filter by organization id (optional)
 * returns List
 **/
exports.attributeGroupsGET = function(name,organizationId) {
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
 * Retrieve header information for a search operation on Attribute Groups in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by group name (optional)
 * organizationId String Filter by organization id (optional)
 * no response value expected for this operation
 **/
exports.attributeGroupsHEAD = function(name,organizationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Remove an existing Attribute Group with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * id String The id
 * no response value expected for this operation
 **/
exports.attributeGroupsIdDELETE = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get Attribute Groups with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * id String The id
 * returns AttributeGroup
 **/
exports.attributeGroupsIdGET = function(id) {
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
 * Get Attribute Group with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * id String The id
 * no response value expected for this operation
 **/
exports.attributeGroupsIdHEAD = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing Attribute Group with given id.  Only the fields in the request body are updated.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * id String The id
 * body AttributeGroupRequestBody 
 * returns AttributeGroup
 **/
exports.attributeGroupsIdPATCH = function(id,body) {
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
 * Create a new Attribute Group.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body AttributeGroupRequestBody 
 * returns AttributeGroup
 **/
exports.attributeGroupsPOST = function(body) {
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

