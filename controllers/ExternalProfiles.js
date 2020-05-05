'use strict';

var utils = require('../utils/writer.js');
var ExternalProfiles = require('../service/ExternalProfilesService');

module.exports.usersUserIdExternalProfilesGET = function usersUserIdExternalProfilesGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var organizationName = req.swagger.params['organizationName'].value;
  ExternalProfiles.usersUserIdExternalProfilesGET(userId,organizationName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesHEAD = function usersUserIdExternalProfilesHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  ExternalProfiles.usersUserIdExternalProfilesHEAD(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesOrganizationIdDELETE = function usersUserIdExternalProfilesOrganizationIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  ExternalProfiles.usersUserIdExternalProfilesOrganizationIdDELETE(userId,organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesOrganizationIdGET = function usersUserIdExternalProfilesOrganizationIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  ExternalProfiles.usersUserIdExternalProfilesOrganizationIdGET(userId,organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesOrganizationIdHEAD = function usersUserIdExternalProfilesOrganizationIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  ExternalProfiles.usersUserIdExternalProfilesOrganizationIdHEAD(userId,organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesOrganizationIdPATCH = function usersUserIdExternalProfilesOrganizationIdPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  var body = req.swagger.params['body'].value;
  ExternalProfiles.usersUserIdExternalProfilesOrganizationIdPATCH(userId,organizationId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdExternalProfilesPOST = function usersUserIdExternalProfilesPOST (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  ExternalProfiles.usersUserIdExternalProfilesPOST(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
