'use strict';

var util = require('util');

/**
 * 権限保持者が検出できなかったことを表すエラー
 *
 * @class PermissionHoldersNotFoundError
 * @constructor
 */
function PermissionHoldersNotFoundError(permissionHolders) {  
  Error.call(this);
  this.name = 'PermissionHoldersNotFoundError';
  this.message = "Permission holders are not found in near.";

  this.data = {
    permissionHolders: permissionHolders
  };

  Error.captureStackTrace(this, PermissionHoldersNotFoundError);
}

util.inherits(PermissionHoldersNotFoundError, Error);

module.exports = PermissionHoldersNotFoundError;
