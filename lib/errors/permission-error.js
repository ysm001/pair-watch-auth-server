'use strict';

var util = require('util');

/**
 * 権限認証に失敗したことを表すエラー
 *
 * @class PermissionError
 * @constructor
 */
function PermissionError(user, permission, requiredUsers) {  
  Error.call(this);
  this.name = 'PermissionError';
  this.message = user.deviceId + " does not have permission[" + permission +  "]";

  this.data = {
    user: user,
    permission: permission,
    requiredUsers: requiredUsers
  };

  Error.captureStackTrace(this, PermissionError);
}

util.inherits(PermissionError, Error);

module.exports = PermissionError;
