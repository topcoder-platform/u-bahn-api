'use strict';


/**
 * Search Achievements Provider in the application.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by provider name (optional)
 * returns List
 **/
exports.achievementsProvidersGET = function(name) {
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
 * Retrieve header information for a search operation on achivements provider in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * name String Filter by provider name (optional)
 * no response value expected for this operation
 **/
exports.achievementsProvidersHEAD = function(name) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Achievements Provider.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body NameRequestBody 
 * returns AchievementsProvider
 **/
exports.achievementsProvidersPOST = function(body) {
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
 * Remove an existing achiements provider with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * providerId String The provider id
 * no response value expected for this operation
 **/
exports.achievementsProvidersProviderIdDELETE = function(providerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get achievements provider with given id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * providerId String The provider id
 * returns AchievementsProvider
 **/
exports.achievementsProvidersProviderIdGET = function(providerId) {
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
 * Get achivements provider with given id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * providerId String The provider id
 * no response value expected for this operation
 **/
exports.achievementsProvidersProviderIdHEAD = function(providerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing achivements provider with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * providerId String The provider id
 * body NameRequestBody 
 * returns AchievementsProvider
 **/
exports.achievementsProvidersProviderIdPATCH = function(providerId,body) {
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

