'use strict';

exports.interviewerGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "roomId" : 101
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

