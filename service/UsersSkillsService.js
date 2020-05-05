'use strict';


/**
 * Filter skills by its name given an user id.  If no results, then empty array is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * skillName String Filter by skill name (through skill id) (optional)
 * returns List
 **/
exports.usersUserIdSkillsGET = function(userId,skillName) {
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
 * Retrieve header information for a search operation on users skills in the application.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created. 
 *
 * userId String The user id
 * skillName String Filter by skill name (through skill id) (optional)
 * no response value expected for this operation
 **/
exports.usersUserIdSkillsHEAD = function(userId,skillName) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new User Skill.  **Security** - This endpoint is accessible by all authenticated users.         
 *
 * userId String The user id
 * body UserSkillRequestBody 
 * returns UserSkill
 **/
exports.usersUserIdSkillsPOST = function(userId,body) {
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
 * Remove an existing User Skill with given ids.  **Security** - Note that this endpoint is only available for admin users.   
 *
 * userId String The user id
 * skillId String The skill id
 * no response value expected for this operation
 **/
exports.usersUserIdSkillsSkillIdDELETE = function(userId,skillId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get User Skills with given user and skill id.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * skillId String The skill id
 * returns UserSkill
 **/
exports.usersUserIdSkillsSkillIdGET = function(userId,skillId) {
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
 * Get User Skills with given ids, but only header information is returned.  **Security** - Note that for non-admin users, this endpoint will only return entities that the user has created.         
 *
 * userId String The user id
 * skillId String The skill id
 * no response value expected for this operation
 **/
exports.usersUserIdSkillsSkillIdHEAD = function(userId,skillId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing skill with given ids.  **Security** - Note that for non-admin users, this endpoint will only allow updates on entities that the calling user has created. 
 *
 * userId String The user id
 * skillId String The skill id
 * body UserSkillUpdateRequestBody 
 * returns UserSkill
 **/
exports.usersUserIdSkillsSkillIdPATCH = function(userId,skillId,body) {
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

