'use strict';


/**
 * Remove an existing User Attribute with given ids.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * attributeId String The attribute id
 * no response value expected for this operation
 **/
exports.usersUserIdAttributesAttributeIdDELETE = function(userId,attributeId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get User Attributes with given user and attribute id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * attributeId String The attribute id
 * returns UserAttribute
 **/
exports.usersUserIdAttributesAttributeIdGET = function(userId,attributeId) {
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
 * Get User Attributes with given ids, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * attributeId String The attribute id
 * no response value expected for this operation
 **/
exports.usersUserIdAttributesAttributeIdHEAD = function(userId,attributeId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing user attribute with given ids.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * userId String The user id
 * attributeId String The attribute id
 * body UserAttributeUpdateRequestBody 
 * returns UserAttribute
 **/
exports.usersUserIdAttributesAttributeIdPATCH = function(userId,attributeId,body) {
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
 * Get attributes for the given user. Optionally, filter attributes by the attribute name, attribute group name and attribute group id, given an user id.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * attributeName String Filter by the attribute name (optional)
 * attributeGroupName String Filter by the attribute group name (optional)
 * attributeGroupId String Filter by the attribute group id (optional)
 * returns List
 **/
exports.usersUserIdAttributesGET = function(userId,attributeName,attributeGroupName,attributeGroupId) {
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
 * Retrieve header information for a search operation on users attributes in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * attributeName String Filter by the attribute name (optional)
 * attributeGroupName String Filter by the attribute group name (optional)
 * attributeGroupId String Filter by the attribute group id (optional)
 * no response value expected for this operation
 **/
exports.usersUserIdAttributesHEAD = function(userId,attributeName,attributeGroupName,attributeGroupId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new User Attribute.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * userId String The user id
 * body UserAttributeRequestBody 
 * returns UserAttribute
 **/
exports.usersUserIdAttributesPOST = function(userId,body) {
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

