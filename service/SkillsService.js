'use strict';


/**
 * Get list of skills in the application.  If no results, then empty array is returned.  Multiple filters are supported.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * returns List
 **/
exports.skillsGET = function() {
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
 * Retrieve header information for get operation on Skills in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * no response value expected for this operation
 **/
exports.skillsHEAD = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new Skill.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * body SkillRequestBody 
 * returns Skill
 **/
exports.skillsPOST = function(body) {
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
 * Remove an existing skill with given id.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * skillId String The skill id
 * no response value expected for this operation
 **/
exports.skillsSkillIdDELETE = function(skillId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get Skill by given skill id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * skillId String The skill id
 * returns Skill
 **/
exports.skillsSkillIdGET = function(skillId) {
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
 * Retrieve header information for get operation on Skill by its Id in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.        
 *
 * skillId String The user id
 * no response value expected for this operation
 **/
exports.skillsSkillIdHEAD = function(skillId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing skill with given id.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * skillId String The skill id
 * body SkillUpdateRequestBody 
 * returns Skill
 **/
exports.skillsSkillIdPATCH = function(skillId,body) {
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

