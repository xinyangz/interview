'use strict';

exports.userLoginGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * username (String)
  * password (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "user" : {
    "password" : "aeiou",
    "organization" : "aeiou",
    "contact" : "aeiou",
    "type" : "aeiou",
    "email" : "aeiou",
    "username" : "aeiou"
  },
  "token" : "123456"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.userLogoutGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.userRegisterPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (User)
  **/
    var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "organization" : "aeiou",
  "contact" : "aeiou",
  "type" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.userUsernameDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * username (String)
  * token (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.userUsernameGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * username (String)
  * token (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "organization" : "aeiou",
  "contact" : "aeiou",
  "type" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.userUsernamePUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * username (String)
  * token (String)
  * body (User)
  **/
    var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "organization" : "aeiou",
  "contact" : "aeiou",
  "type" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

