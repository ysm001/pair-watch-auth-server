'use strict';

var util = require('util');

function PermissionHoldersNotFoundError(permissionHolders) {  
  Error.call(this);
  this.message = "Permission holders are not found in near.";
  this.permissionHolders = permissionHolders;

  Error.captureStackTrace(this, PermissionHoldersNotFoundError);
}

util.inherits(PermissionHoldersNotFoundError, Error);

module.exports = PermissionHoldersNotFoundError;
