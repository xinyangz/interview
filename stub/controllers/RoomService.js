'use strict';

exports.roomGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "rooms" : [ {
    "interviewer" : "aeiou",
    "candidates" : [ "aeiou" ],
    "name" : "计蒜课秋招（前端）",
    "logo" : "http://example.com/examplepage",
    "id" : "1001",
    "problems" : [ "aeiou" ]
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

exports.roomRoom_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.roomRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "aeiou",
  "candidates" : [ "aeiou" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : "1001",
  "problems" : [ "aeiou" ]
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
  * room_id (String)
  * body (Room)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "interviewer" : "aeiou",
  "candidates" : [ "aeiou" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : "1001",
  "problems" : [ "aeiou" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

