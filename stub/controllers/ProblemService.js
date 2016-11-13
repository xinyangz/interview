'use strict';

exports.problemProblem_idDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * problem_id (Integer)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.problemProblem_idGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * problem_id (Integer)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
    "id": "3901",
    "roomId": "1001",
    "type": "choice",
    "content": {
      "title": "题目1",
      "description": "这是一个面试题样例",
      "option": [
        {
          "content": "string",
          "correct": true
        }
      ]
    }
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
  * problem_id (Integer)
  * problem (Problem)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
    "id": "3901",
    "roomId": "1001",
    "type": "choice",
    "content": {
      "title": "题目1",
      "description": "这是一个面试题样例",
      "option": [
        {
          "content": "string",
          "correct": true
        }
      ]
    }
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
  * room_id (Integer)
  * token (String)
  * offset (Integer)
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
    "offset": 0,
    "limit": 0,
    "problems": [
      {
        "id": "3901",
        "roomId": "1001",
        "type": "choice",
        "content": {
          "title": "选择题1",
          "description": "这是一个面试题样例",
          "option": [
            {
              "content": "string",
              "correct": true
            }
          ],
          "sampleInput": "1 2",
          "sampleOutput": "-1"
        }
      },
      {
        "id": "3902",
        "roomId": "1001",
        "type": "blank",
        "content": {
          "title": "填空题1  ",
          "description": "这是一个面试题样例"
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
  * room_id (Integer)
  * problem (ProblemIn)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
    "id": "3901",
    "roomId": "1001",
    "type": "choice",
    "content": {
      "title": "题目1",
      "description": "这是一个面试题样例",
      "option": [
        {
          "content": "string",
          "correct": true
        }
      ],
      "sampleInput": "1 2",
      "sampleOutput": "-1"
    }
  };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

