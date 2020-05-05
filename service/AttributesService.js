'use strict';


/**
 * Remove an existing attribute with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * attributeId String The attribute id
 * no response value expected for this operation
 **/
exports.attributesAttributeIdDELETE = function(attributeId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get Attribute by given attribute id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * attributeId String The attribute id
 * returns Attribute
 **/
exports.attributesAttributeIdGET = function(attributeId) {
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
 * Retrieve header information for get operation on Attribute by its id in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.        
 *
 * attributeId String The attribute id
 * no response value expected for this operation
 **/
exports.attributesAttributeIdHEAD = function(attributeId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing attribute with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * attributeId String The attribute id
 * body AttributeUpdateRequestBody 
 * returns Attribute
 **/
exports.attributesAttributeIdPATCH = function(attributeId,body) {
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
 * Get list of attributes in the application.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * attributeGroupId String Filter by attribute group id (optional)
 * name String Filter by attribute name (optional)
 * returns List
 **/
exports.attributesGET = function(attributeGroupId,name) {
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
 * Retrieve header information for get operation on Attributes in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * no response value expected for this operation
 **/
exports.attributesHEAD = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Attribute.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body AttributeRequestBody 
 * returns Attribute
 **/
exports.attributesPOST = function(body) {
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

