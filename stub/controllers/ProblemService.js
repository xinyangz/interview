'use strict';

exports.problemRoom_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "offset" : 123,
  "limit" : 123,
  "problems" : [ {
    "id" : "3901",
    "type" : "choice",
    "roomId" : "1001"
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

exports.problemRoom_idPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * problem (Problem)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

