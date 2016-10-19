'use strict';

var url = require('url');


var User = require('./UserService');


module.exports.userLoginGET = function userLoginGET (req, res, next) {
  User.userLoginGET(req.swagger.params, res, next);
};

module.exports.userLogoutGET = function userLogoutGET (req, res, next) {
  User.userLogoutGET(req.swagger.params, res, next);
};

module.exports.userRegisterPOST = function userRegisterPOST (req, res, next) {
  User.userRegisterPOST(req.swagger.params, res, next);
};

module.exports.userUsernameDELETE = function userUsernameDELETE (req, res, next) {
  User.userUsernameDELETE(req.swagger.params, res, next);
};

module.exports.userUsernameGET = function userUsernameGET (req, res, next) {
  User.userUsernameGET(req.swagger.params, res, next);
};

module.exports.userUsernamePUT = function userUsernamePUT (req, res, next) {
  User.userUsernamePUT(req.swagger.params, res, next);
};
