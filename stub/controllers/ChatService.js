'use strict';

exports.chatCandidate_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "offset" : 123,
  "limit" : 123,
  "chats" : [ {
    "sender" : true,
    "id" : "10001",
    "time" : "2016-01-20T13:30:00Z",
    "text" : "aeiou",
    "candidateId" : "101"
  } ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.chatCandidate_idPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * chat (Chat)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

