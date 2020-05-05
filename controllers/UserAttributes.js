'use strict';

var utils = require('../utils/writer.js');
var UserAttributes = require('../service/UserAttributesService');

module.exports.usersUserIdAttributesAttributeIdDELETE = function usersUserIdAttributesAttributeIdDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeId = req.swagger.params['attributeId'].value;
  UserAttributes.usersUserIdAttributesAttributeIdDELETE(userId,attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesAttributeIdGET = function usersUserIdAttributesAttributeIdGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeId = req.swagger.params['attributeId'].value;
  UserAttributes.usersUserIdAttributesAttributeIdGET(userId,attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesAttributeIdHEAD = function usersUserIdAttributesAttributeIdHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeId = req.swagger.params['attributeId'].value;
  UserAttributes.usersUserIdAttributesAttributeIdHEAD(userId,attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesAttributeIdPATCH = function usersUserIdAttributesAttributeIdPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeId = req.swagger.params['attributeId'].value;
  var body = req.swagger.params['body'].value;
  UserAttributes.usersUserIdAttributesAttributeIdPATCH(userId,attributeId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesGET = function usersUserIdAttributesGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeName = req.swagger.params['attributeName'].value;
  var attributeGroupName = req.swagger.params['attributeGroupName'].value;
  var attributeGroupId = req.swagger.params['attributeGroupId'].value;
  UserAttributes.usersUserIdAttributesGET(userId,attributeName,attributeGroupName,attributeGroupId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesHEAD = function usersUserIdAttributesHEAD (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var attributeName = req.swagger.params['attributeName'].value;
  var attributeGroupName = req.swagger.params['attributeGroupName'].value;
  var attributeGroupId = req.swagger.params['attributeGroupId'].value;
  UserAttributes.usersUserIdAttributesHEAD(userId,attributeName,attributeGroupName,attributeGroupId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdAttributesPOST = function usersUserIdAttributesPOST (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var body = req.swagger.params['body'].value;
  UserAttributes.usersUserIdAttributesPOST(userId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
