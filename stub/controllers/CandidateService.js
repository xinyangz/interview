'use strict';

exports.candidateCandidate_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.candidateCandidate_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "aeiou",
    "chat" : "aeiou",
    "report" : "aeiou",
    "video" : "aeiou",
    "board" : "aeiou"
  },
  "name" : "Mike",
  "id" : "3001",
  "email" : "example@example.com",
  "roomId" : "1001",
  "status" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidateCandidate_idPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * candidate (Candidate)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "aeiou",
    "chat" : "aeiou",
    "report" : "aeiou",
    "video" : "aeiou",
    "board" : "aeiou"
  },
  "name" : "Mike",
  "id" : "3001",
  "email" : "asdfasdf@example.com",
  "roomId" : "1001",
  "status" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidateCandidate_idStatusPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (String)
  * status (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "aeiou",
    "chat" : "aeiou",
    "report" : "aeiou",
    "video" : "aeiou",
    "board" : "aeiou"
  },
  "name" : "Mike",
  "id" : "3001",
  "email" : "dsfsdf@example.com",
  "roomId" : "1001",
  "status" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidateGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "candidates" : [ {
    "phone" : "1300000000",
    "record" : {
      "code" : "aeiou",
      "chat" : "aeiou",
      "report" : "aeiou",
      "video" : "aeiou",
      "board" : "aeiou"
    },
    "name" : "Mike",
    "id" : "3001",
    "email" : "asdfasdf@example.com",
    "roomId" : "1001",
    "status" : "aeiou"
  } ],
  "offset" : 123,
  "limit" : 123,
  "count" : 123
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidatePOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate (Candidate)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "aeiou",
    "chat" : "aeiou",
    "report" : "aeiou",
    "video" : "aeiou",
    "board" : "aeiou"
  },
  "name" : "Mike",
  "id" : "3001",
  "email" : "example@example.com",
  "roomId" : "1001",
  "status" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

