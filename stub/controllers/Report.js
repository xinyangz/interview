'use strict';

var url = require('url');


var Report = require('./ReportService');


module.exports.reportCandidate_idGET = function reportCandidate_idGET (req, res, next) {
  Report.reportCandidate_idGET(req.swagger.params, res, next);
};

module.exports.reportCandidate_idPUT = function reportCandidate_idPUT (req, res, next) {
  Report.reportCandidate_idPUT(req.swagger.params, res, next);
};
