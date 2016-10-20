'use strict';

var url = require('url');


var Room = require('./RoomService');


module.exports.roomGET = function roomGET (req, res, next) {
  Room.roomGET(req.swagger.params, res, next);
};

module.exports.roomRoom_idDELETE = function roomRoom_idDELETE (req, res, next) {
  Room.roomRoom_idDELETE(req.swagger.params, res, next);
};

module.exports.roomRoom_idGET = function roomRoom_idGET (req, res, next) {
  Room.roomRoom_idGET(req.swagger.params, res, next);
};

module.exports.roomRoom_idPUT = function roomRoom_idPUT (req, res, next) {
  Room.roomRoom_idPUT(req.swagger.params, res, next);
};
