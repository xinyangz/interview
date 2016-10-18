'use strict';

var url = require('url');


var Candidate = require('./CandidateService');


module.exports.candidateCandidate_idDELETE = function candidateCandidate_idDELETE (req, res, next) {
  Candidate.candidateCandidate_idDELETE(req.swagger.params, res, next);
};

module.exports.candidateCandidate_idGET = function candidateCandidate_idGET (req, res, next) {
  Candidate.candidateCandidate_idGET(req.swagger.params, res, next);
};

module.exports.candidateCandidate_idPUT = function candidateCandidate_idPUT (req, res, next) {
  Candidate.candidateCandidate_idPUT(req.swagger.params, res, next);
};

module.exports.candidateCandidate_idStatusPUT = function candidateCandidate_idStatusPUT (req, res, next) {
  Candidate.candidateCandidate_idStatusPUT(req.swagger.params, res, next);
};

module.exports.candidateGET = function candidateGET (req, res, next) {
  Candidate.candidateGET(req.swagger.params, res, next);
};

module.exports.candidatePOST = function candidatePOST (req, res, next) {
  Candidate.candidatePOST(req.swagger.params, res, next);
};
