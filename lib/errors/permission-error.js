'use strict';

var util = require('util');

function PermissionError(user, permission, requiredUsers) {  
  Error.call(this);
  this.name = 'PermissionError';
  this.message = user + " do not have permission[" + permission +  "]";

  this.data = {
    user: user,
    permission: permission,
    requiredUsers: requiredUsers
  };

  Error.captureStackTrace(this, PermissionError);
}

util.inherits(PermissionError, Error);

module.exports = PermissionError;
