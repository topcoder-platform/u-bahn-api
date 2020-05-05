'use strict';

var utils = require('../utils/writer.js');
var Roles = require('../service/RolesService');

module.exports.rolesGET = function rolesGET (req, res, next) {
  var name = req.swagger.params['name'].value;
  Roles.rolesGET(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesHEAD = function rolesHEAD (req, res, next) {
  var name = req.swagger.params['name'].value;
  Roles.rolesHEAD(name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesPOST = function rolesPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Roles.rolesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesRoleIdDELETE = function rolesRoleIdDELETE (req, res, next) {
  var roleId = req.swagger.params['roleId'].value;
  Roles.rolesRoleIdDELETE(roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesRoleIdGET = function rolesRoleIdGET (req, res, next) {
  var roleId = req.swagger.params['roleId'].value;
  Roles.rolesRoleIdGET(roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesRoleIdHEAD = function rolesRoleIdHEAD (req, res, next) {
  var roleId = req.swagger.params['roleId'].value;
  Roles.rolesRoleIdHEAD(roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rolesRoleIdPATCH = function rolesRoleIdPATCH (req, res, next) {
  var roleId = req.swagger.params['roleId'].value;
  var body = req.swagger.params['body'].value;
  Roles.rolesRoleIdPATCH(roleId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
