'use strict';

var utils = require('../utils/writer.js');
var Attributes = require('../service/AttributesService');

module.exports.attributesAttributeIdDELETE = function attributesAttributeIdDELETE (req, res, next) {
  var attributeId = req.swagger.params['attributeId'].value;
  Attributes.attributesAttributeIdDELETE(attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesAttributeIdGET = function attributesAttributeIdGET (req, res, next) {
  var attributeId = req.swagger.params['attributeId'].value;
  Attributes.attributesAttributeIdGET(attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesAttributeIdHEAD = function attributesAttributeIdHEAD (req, res, next) {
  var attributeId = req.swagger.params['attributeId'].value;
  Attributes.attributesAttributeIdHEAD(attributeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesAttributeIdPATCH = function attributesAttributeIdPATCH (req, res, next) {
  var attributeId = req.swagger.params['attributeId'].value;
  var body = req.swagger.params['body'].value;
  Attributes.attributesAttributeIdPATCH(attributeId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesGET = function attributesGET (req, res, next) {
  var attributeGroupId = req.swagger.params['attributeGroupId'].value;
  var name = req.swagger.params['name'].value;
  Attributes.attributesGET(attributeGroupId,name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesHEAD = function attributesHEAD (req, res, next) {
  Attributes.attributesHEAD()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributesPOST = function attributesPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Attributes.attributesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
