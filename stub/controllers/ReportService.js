'use strict';

exports.reportCandidate_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.reportCandidate_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "id" : "7001",
  "text" : "aeiou",
  "roomId" : "101"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.reportCandidate_idPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * text (Report)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "id" : "7001",
  "text" : "aeiou",
  "roomId" : "101"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

