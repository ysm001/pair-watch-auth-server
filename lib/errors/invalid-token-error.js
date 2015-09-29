'use strict';

const util = require('util');

/**
 * 不正なトークンを受信したことを表すエラー
 *
 * @class InvalidTokenError
 * @constructor
 */
function InvalidTokenError() {  
  Error.call(this);
  this.name = 'InvalidTokenError';
  this.message = "Invalid token.";

  Error.captureStackTrace(this, InvalidTokenError);
};

util.inherits(InvalidTokenError, Error);

module.exports = InvalidTokenError;
