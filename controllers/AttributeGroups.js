'use strict';

var utils = require('../utils/writer.js');
var AttributeGroups = require('../service/AttributeGroupsService');

module.exports.attributeGroupsGET = function attributeGroupsGET (req, res, next) {
  var name = req.swagger.params['name'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  AttributeGroups.attributeGroupsGET(name,organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsHEAD = function attributeGroupsHEAD (req, res, next) {
  var name = req.swagger.params['name'].value;
  var organizationId = req.swagger.params['organizationId'].value;
  AttributeGroups.attributeGroupsHEAD(name,organizationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsIdDELETE = function attributeGroupsIdDELETE (req, res, next) {
  var id = req.swagger.params['id'].value;
  AttributeGroups.attributeGroupsIdDELETE(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsIdGET = function attributeGroupsIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  AttributeGroups.attributeGroupsIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsIdHEAD = function attributeGroupsIdHEAD (req, res, next) {
  var id = req.swagger.params['id'].value;
  AttributeGroups.attributeGroupsIdHEAD(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsIdPATCH = function attributeGroupsIdPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  AttributeGroups.attributeGroupsIdPATCH(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.attributeGroupsPOST = function attributeGroupsPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  AttributeGroups.attributeGroupsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
