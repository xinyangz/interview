'use strict';

var url = require('url');


var Interviewer = require('./InterviewerService');


module.exports.interviewerGET = function interviewerGET (req, res, next) {
  Interviewer.interviewerGET(req.swagger.params, res, next);
};
