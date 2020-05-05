'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');

module.exports.usersGET = function usersGET (req, res, next) {
  var handle = req.swagger.params['handle'].value;
  var isAvailable = req.swagger.params['isAvailable'].value;
  var groupId = req.swagger.params['groupId'].value;
  var roleId = req.swagger.params['roleId'].value;
  Users.usersGET(handle,isAvailable,groupId,roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersHEAD = function usersHEAD (req, res, next) {
  var handle = req.swagger.params['handle'].value;
  var isAvailable = req.swagger.params['isAvailable'].value;
  var groupId = req.swagger.params['groupId'].value;
  var roleId = req.swagger.params['roleId'].value;
  Users.usersHEAD(handle,isAvailable,groupId,roleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersPOST = function usersPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Users.usersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdDELETE = function usersUserIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  Users.usersUserIdDELETE(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdGET = function usersUserIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  Users.usersUserIdGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdHEAD = function usersUserIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  Users.usersUserIdHEAD(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdPATCH = function usersUserIdPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  Users.usersUserIdPATCH(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
