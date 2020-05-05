'use strict';


/**
 * Remove an existing Achievement with given userId and achievement providerId.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * achievementsProviderId String The provider id
 * no response value expected for this operation
 **/
exports.usersUserIdAchievementsAchievementsProviderIdDELETE = function(userId,achievementsProviderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get Achievements for given user id and provider id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * achievementsProviderId String The provider id
 * returns List
 **/
exports.usersUserIdAchievementsAchievementsProviderIdGET = function(userId,achievementsProviderId) {
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
 * Get Achievements for given user id and provider id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * achievementsProviderId String The provider id
 * no response value expected for this operation
 **/
exports.usersUserIdAchievementsAchievementsProviderIdHEAD = function(userId,achievementsProviderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing Achievement with given userId and achievement providerId.  Only the fields in the request body are updated.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * userId String The user id
 * achievementsProviderId String The provider id
 * body AchievementUpdateRequestBody 
 * returns Achievement
 **/
exports.usersUserIdAchievementsAchievementsProviderIdPATCH = function(userId,achievementsProviderId,body) {
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
 * Get Achievements for given user id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * achievementsproviderName String The achievement provider name (optional)
 * returns List
 **/
exports.usersUserIdAchievementsGET = function(userId,achievementsproviderName) {
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
 * Get Achievements for given user id, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * achievementsproviderName String The achievement provider name (optional)
 * no response value expected for this operation
 **/
exports.usersUserIdAchievementsHEAD = function(userId,achievementsproviderName) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Achievement.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * userId String The user id
 * body AchievementRequestBody 
 * returns Achievement
 **/
exports.usersUserIdAchievementsPOST = function(userId,body) {
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

