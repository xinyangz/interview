'use strict';

exports.roomGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "rooms" : [ {
    "interviewer" : "Jason Yip",
    "candidates" : [],
    "name" : "计蒜课秋招（前端）",
    "logo" : "http://example.com/examplepage",
    "id" : "101",
    "problems" : [ "1001", "1002", "1003" ]
  },
  {
    "interviewer" : "Jiang Ma",
    "candidates" : [ "1", "2", "3", "4", "5", "6" ],
    "name" : "计蒜课秋招（后端）",
    "logo" : "http://example.com/examplepage",
    "id" : "102",
    "problems" : [ "1011", "1012", "1013", "1014" ]
  } ],
  "offset" : 0,
  "limit" : 20,
  "count" : 2
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.roomRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
    "interviewer" : "Jason Yip",
    "candidates" : [],
    "name" : "计蒜课秋招（前端）",
    "logo" : "http://example.com/examplepage",
    "id" : "101",
    "problems" : [ "1001", "1002", "1003" ]
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
    "interviewer" : "Jason Yip",
    "candidates" : [],
    "name" : "计蒜课秋招（前端）",
    "logo" : "http://example.com/examplepage",
    "id" : "101",
    "problems" : [ "1001", "1002", "1003" ]
  };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}
