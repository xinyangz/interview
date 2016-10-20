'use strict';

var url = require('url');


var Problem = require('./ProblemService');


module.exports.problemProblem_idDELETE = function problemProblem_idDELETE (req, res, next) {
  Problem.problemProblem_idDELETE(req.swagger.params, res, next);
};

module.exports.problemProblem_idGET = function problemProblem_idGET (req, res, next) {
  Problem.problemProblem_idGET(req.swagger.params, res, next);
};

module.exports.problemProblem_idPUT = function problemProblem_idPUT (req, res, next) {
  Problem.problemProblem_idPUT(req.swagger.params, res, next);
};

module.exports.problemRoomRoom_idGET = function problemRoomRoom_idGET (req, res, next) {
  Problem.problemRoomRoom_idGET(req.swagger.params, res, next);
};

module.exports.problemRoomRoom_idPOST = function problemRoomRoom_idPOST (req, res, next) {
  Problem.problemRoomRoom_idPOST(req.swagger.params, res, next);
};
