'use strict';

exports.roomGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "rooms" : [ {
    "interviewer" : "",
    "candidates" : [ "" ],
    "name" : "计蒜课秋招（前端）",
    "logo" : "http://example.com/examplepage",
    "id" : 1001,
    "problems" : [ "" ]
  } ],
  "offset" : 0,
  "limit" : 20,
  "count" : 1
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.roomPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room (RoomPost)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "",
  "candidates" : [ "" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : 1001,
  "problems" : [ "" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.roomRoom_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.roomRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "",
  "candidates" : [ "" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : 1001,
  "problems" : [ "" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.roomRoom_idLogoPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "",
  "candidates" : [ "" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : 1001,
  "problems" : [ "" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.roomRoom_idPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (Integer)
  * room (RoomPost)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "",
  "candidates" : [ "" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : 1001,
  "problems" : [ "" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

