'use strict';

var url = require('url');


var Chat = require('./ChatService');


module.exports.chatCandidate_idGET = function chatCandidate_idGET (req, res, next) {
  Chat.chatCandidate_idGET(req.swagger.params, res, next);
};

module.exports.chatCandidate_idPOST = function chatCandidate_idPOST (req, res, next) {
  Chat.chatCandidate_idPOST(req.swagger.params, res, next);
};
