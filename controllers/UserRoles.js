'use strict';

var utils = require('../utils/writer.js');
var UserRoles = require('../service/UserRolesService');

module.exports.usersUserIdRolesGET = function usersUserIdRolesGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  UserRoles.usersUserIdRolesGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdRolesHEAD = function usersUserIdRolesHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  UserRoles.usersUserIdRolesHEAD(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdRolesPOST = function usersUserIdRolesPOST (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  UserRoles.usersUserIdRolesPOST(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdRolesRoleIdDELETE = function usersUserIdRolesRoleIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var roleId = req.swagger.params['roleId'].value;
  UserRoles.usersUserIdRolesRoleIdDELETE(userId,roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdRolesRoleIdGET = function usersUserIdRolesRoleIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var roleId = req.swagger.params['roleId'].value;
  UserRoles.usersUserIdRolesRoleIdGET(userId,roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdRolesRoleIdHEAD = function usersUserIdRolesRoleIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var roleId = req.swagger.params['roleId'].value;
  UserRoles.usersUserIdRolesRoleIdHEAD(userId,roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
