'use strict';

var utils = require('../utils/writer.js');
var Skills = require('../service/SkillsService');

module.exports.skillsGET = function skillsGET (req, res, next) {
  Skills.skillsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsHEAD = function skillsHEAD (req, res, next) {
  Skills.skillsHEAD()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsPOST = function skillsPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Skills.skillsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsSkillIdDELETE = function skillsSkillIdDELETE (req, res, next) {
  var skillId = req.swagger.params['skillId'].value;
  Skills.skillsSkillIdDELETE(skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsSkillIdGET = function skillsSkillIdGET (req, res, next) {
  var skillId = req.swagger.params['skillId'].value;
  Skills.skillsSkillIdGET(skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsSkillIdHEAD = function skillsSkillIdHEAD (req, res, next) {
  var skillId = req.swagger.params['skillId'].value;
  Skills.skillsSkillIdHEAD(skillId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsSkillIdPATCH = function skillsSkillIdPATCH (req, res, next) {
  var skillId = req.swagger.params['skillId'].value;
  var body = req.swagger.params['body'].value;
  Skills.skillsSkillIdPATCH(skillId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
