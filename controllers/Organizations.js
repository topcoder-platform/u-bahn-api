'use strict';

var utils = require('../utils/writer.js');
var Organizations = require('../service/OrganizationsService');

module.exports.organizationsGET = function organizationsGET (req, res, next) {
  var name = req.swagger.params['name'].value;
  Organizations.organizationsGET(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsHEAD = function organizationsHEAD (req, res, next) {
  var name = req.swagger.params['name'].value;
  Organizations.organizationsHEAD(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsOrganizationIdDELETE = function organizationsOrganizationIdDELETE (req, res, next) {
  var organizationId = req.swagger.params['organizationId'].value;
  Organizations.organizationsOrganizationIdDELETE(organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsOrganizationIdGET = function organizationsOrganizationIdGET (req, res, next) {
  var organizationId = req.swagger.params['organizationId'].value;
  Organizations.organizationsOrganizationIdGET(organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsOrganizationIdHEAD = function organizationsOrganizationIdHEAD (req, res, next) {
  var organizationId = req.swagger.params['organizationId'].value;
  Organizations.organizationsOrganizationIdHEAD(organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsOrganizationIdPATCH = function organizationsOrganizationIdPATCH (req, res, next) {
  var organizationId = req.swagger.params['organizationId'].value;
  var body = req.swagger.params['body'].value;
  Organizations.organizationsOrganizationIdPATCH(organizationId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.organizationsPOST = function organizationsPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Organizations.organizationsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
