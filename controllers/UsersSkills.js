'use strict';

var utils = require('../utils/writer.js');
var UsersSkills = require('../service/UsersSkillsService');

module.exports.usersUserIdSkillsGET = function usersUserIdSkillsGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillName = req.swagger.params['skillName'].value;
  UsersSkills.usersUserIdSkillsGET(userId,skillName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsHEAD = function usersUserIdSkillsHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillName = req.swagger.params['skillName'].value;
  UsersSkills.usersUserIdSkillsHEAD(userId,skillName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsPOST = function usersUserIdSkillsPOST (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  UsersSkills.usersUserIdSkillsPOST(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsSkillIdDELETE = function usersUserIdSkillsSkillIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillId = req.swagger.params['skillId'].value;
  UsersSkills.usersUserIdSkillsSkillIdDELETE(userId,skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsSkillIdGET = function usersUserIdSkillsSkillIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillId = req.swagger.params['skillId'].value;
  UsersSkills.usersUserIdSkillsSkillIdGET(userId,skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsSkillIdHEAD = function usersUserIdSkillsSkillIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillId = req.swagger.params['skillId'].value;
  UsersSkills.usersUserIdSkillsSkillIdHEAD(userId,skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdSkillsSkillIdPATCH = function usersUserIdSkillsSkillIdPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var skillId = req.swagger.params['skillId'].value;
  var body = req.swagger.params['body'].value;
  UsersSkills.usersUserIdSkillsSkillIdPATCH(userId,skillId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
