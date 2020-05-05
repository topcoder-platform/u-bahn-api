'use strict';

var utils = require('../utils/writer.js');
var SkillsProvider = require('../service/SkillsProviderService');

module.exports.skillsProvidersGET = function skillsProvidersGET (req, res, next) {
  var name = req.swagger.params['name'].value;
  SkillsProvider.skillsProvidersGET(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersHEAD = function skillsProvidersHEAD (req, res, next) {
  var name = req.swagger.params['name'].value;
  SkillsProvider.skillsProvidersHEAD(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersPOST = function skillsProvidersPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  SkillsProvider.skillsProvidersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersProviderIdDELETE = function skillsProvidersProviderIdDELETE (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  SkillsProvider.skillsProvidersProviderIdDELETE(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersProviderIdGET = function skillsProvidersProviderIdGET (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  SkillsProvider.skillsProvidersProviderIdGET(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersProviderIdHEAD = function skillsProvidersProviderIdHEAD (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  SkillsProvider.skillsProvidersProviderIdHEAD(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.skillsProvidersProviderIdPATCH = function skillsProvidersProviderIdPATCH (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  var body = req.swagger.params['body'].value;
  SkillsProvider.skillsProvidersProviderIdPATCH(providerId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
