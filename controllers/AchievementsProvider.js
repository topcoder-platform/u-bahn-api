'use strict';

var utils = require('../utils/writer.js');
var AchievementsProvider = require('../service/AchievementsProviderService');

module.exports.achievementsProvidersGET = function achievementsProvidersGET (req, res, next) {
  var name = req.swagger.params['name'].value;
  AchievementsProvider.achievementsProvidersGET(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersHEAD = function achievementsProvidersHEAD (req, res, next) {
  var name = req.swagger.params['name'].value;
  AchievementsProvider.achievementsProvidersHEAD(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersPOST = function achievementsProvidersPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  AchievementsProvider.achievementsProvidersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersProviderIdDELETE = function achievementsProvidersProviderIdDELETE (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  AchievementsProvider.achievementsProvidersProviderIdDELETE(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersProviderIdGET = function achievementsProvidersProviderIdGET (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  AchievementsProvider.achievementsProvidersProviderIdGET(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersProviderIdHEAD = function achievementsProvidersProviderIdHEAD (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  AchievementsProvider.achievementsProvidersProviderIdHEAD(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.achievementsProvidersProviderIdPATCH = function achievementsProvidersProviderIdPATCH (req, res, next) {
  var providerId = req.swagger.params['providerId'].value;
  var body = req.swagger.params['body'].value;
  AchievementsProvider.achievementsProvidersProviderIdPATCH(providerId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
