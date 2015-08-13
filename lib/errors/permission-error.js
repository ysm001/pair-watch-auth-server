'use strict';

var util = require('util');

function PermissionError(user, permission, requiredUsers) {  
  Error.call(this);
  this.name = 'PermissionError';
  this.user = user;
  this.permission =  permission;
  this.requiredUsers = requiredUsers;

  this.message = user + " do not have permission[" + permission +  "]";
}

util.inherits(PermissionError, Error);

module.exports = PermissionError;
