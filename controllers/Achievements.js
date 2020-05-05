'use strict';

var utils = require('../utils/writer.js');
var Achievements = require('../service/AchievementsService');

module.exports.usersUserIdAchievementsAchievementsProviderIdDELETE = function usersUserIdAchievementsAchievementsProviderIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsProviderId = req.swagger.params['achievementsProviderId'].value;
  Achievements.usersUserIdAchievementsAchievementsProviderIdDELETE(userId,achievementsProviderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsAchievementsProviderIdGET = function usersUserIdAchievementsAchievementsProviderIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsProviderId = req.swagger.params['achievementsProviderId'].value;
  Achievements.usersUserIdAchievementsAchievementsProviderIdGET(userId,achievementsProviderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsAchievementsProviderIdHEAD = function usersUserIdAchievementsAchievementsProviderIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsProviderId = req.swagger.params['achievementsProviderId'].value;
  Achievements.usersUserIdAchievementsAchievementsProviderIdHEAD(userId,achievementsProviderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsAchievementsProviderIdPATCH = function usersUserIdAchievementsAchievementsProviderIdPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsProviderId = req.swagger.params['achievementsProviderId'].value;
  var body = req.swagger.params['body'].value;
  Achievements.usersUserIdAchievementsAchievementsProviderIdPATCH(userId,achievementsProviderId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsGET = function usersUserIdAchievementsGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsproviderName = req.swagger.params['achievementsproviderName'].value;
  Achievements.usersUserIdAchievementsGET(userId,achievementsproviderName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsHEAD = function usersUserIdAchievementsHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var achievementsproviderName = req.swagger.params['achievementsproviderName'].value;
  Achievements.usersUserIdAchievementsHEAD(userId,achievementsproviderName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAchievementsPOST = function usersUserIdAchievementsPOST (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  Achievements.usersUserIdAchievementsPOST(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
