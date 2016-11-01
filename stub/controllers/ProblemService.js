'use strict';

exports.problemProblem_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * problem_id (String)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.problemProblem_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * problem_id (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "id" : "3901",
  "type" : "choice",
  "roomId" : "1001"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.problemProblem_idPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * problem_id (String)
  * problem (Problem)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "id" : "3901",
  "type" : "choice",
  "roomId" : "1001"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.problemRoomRoom_idGET = function(args, res, next) {
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
  "problems" : [
    {
      id: "12345",
      roomId: "2412",
      type: "choice",
      content: {
        title: "这是一道选择题",
        description: "按M可",
        option: ["安轨", "赛艇", "吟诗", "拿衣服"]
      }
    },
    {
      id: "2333",
      roomId: "2341",
      type: "blank",
      content: {
        title: "这是一道填空题",
        description: "美国的【】，比你们高到不知道哪里去了"
      }
    }
  ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

exports.problemRoomRoom_idPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * room_id (String)
  * problem (Problem)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

