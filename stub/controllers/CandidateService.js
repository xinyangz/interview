'use strict';

exports.candidateCandidate_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (Integer)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.candidateCandidate_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * candidate_id (Integer)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "",
    "chat" : "",
    "report" : "",
    "video" : "",
    "board" : ""
  },
  "name" : "Mike",
  "id" : 3001,
  "email" : "example@example.com",
  "roomId" : 1001,
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
  * candidate_id (Integer)
  * candidate (Candidate)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "",
    "chat" : "",
    "report" : "",
    "video" : "",
    "board" : ""
  },
  "name" : "Mike",
  "id" : 3001,
  "email" : "example@example.com",
  "roomId" : 1001,
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
  * candidate_id (Integer)
  * status (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "",
    "chat" : "",
    "report" : "",
    "video" : "",
    "board" : ""
  },
  "name" : "Mike",
  "id" : 3001,
  "email" : "example@example.com",
  "roomId" : 1001,
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

exports.candidateFileGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "xlsx" : "https://example.com/example.xlsx",
  "csv" : "https://example.com/example.csv"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidateFilePOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = "";
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.candidateFileGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "xlsx" : "https://example.com/example.xlsx",
  "csv" : "https://example.com/example.csv"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.candidateFilePOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = "";
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
      "code" : "",
      "chat" : "",
      "report" : "",
      "video" : "",
      "board" : ""
    },
    "name" : "Mike",
    "id" : 3001,
    "email" : "example@example.com",
    "roomId" : 1001,
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
  * candidate (PostCandidate)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "phone" : "1300000000",
  "record" : {
    "code" : "",
    "chat" : "",
    "report" : "",
    "video" : "",
    "board" : ""
  },
  "name" : "Mike",
  "id" : 3001,
  "email" : "example@example.com",
  "roomId" : 1001,
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

exports.candidateRoomRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "candidates" : [ {
    "phone" : "1300000000",
    "record" : {
      "code" : "",
      "chat" : "",
      "report" : "",
      "video" : "",
      "board" : ""
    },
    "name" : "Mike",
    "id" : 3001,
    "email" : "example@example.com",
    "roomId" : 1001,
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

exports.candidateRoomRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "candidates" : [ {
    "phone" : "1300000000",
    "record" : {
      "code" : "",
      "chat" : "",
      "report" : "",
      "video" : "",
      "board" : ""
    },
    "name" : "Mike",
    "id" : 3001,
    "email" : "example@example.com",
    "roomId" : 1001,
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

