'use strict';

var url = require('url');


var Problem = require('./ProblemService');


module.exports.problemRoom_idGET = function problemRoom_idGET (req, res, next) {
  Problem.problemRoom_idGET(req.swagger.params, res, next);
};

module.exports.problemRoom_idPOST = function problemRoom_idPOST (req, res, next) {
  Problem.problemRoom_idPOST(req.swagger.params, res, next);
};
