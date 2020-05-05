'use strict';


/**
 * Search Skills Provider in the application.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by provider name (optional)
 * returns List
 **/
exports.skillsProvidersGET = function(name) {
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
 * Retrieve header information for a search operation on skills providers in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by provider name (optional)
 * no response value expected for this operation
 **/
exports.skillsProvidersHEAD = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Skills Provider.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body NameRequestBody 
 * returns SkillsProvider
 **/
exports.skillsProvidersPOST = function(body) {
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
 * Remove an existing skills provider with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * providerId String The provider id
 * no response value expected for this operation
 **/
exports.skillsProvidersProviderIdDELETE = function(providerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get skills provider with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * providerId String The provider id
 * returns SkillsProvider
 **/
exports.skillsProvidersProviderIdGET = function(providerId) {
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
 * Get skills provider with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * providerId String The provider id
 * no response value expected for this operation
 **/
exports.skillsProvidersProviderIdHEAD = function(providerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing skills provider with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * providerId String The provider id
 * body NameRequestBody 
 * returns SkillsProvider
 **/
exports.skillsProvidersProviderIdPATCH = function(providerId,body) {
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

