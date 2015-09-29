'use strict';

const util = require('util');

/**
 * クライアントから返信が無かったことを表すエラー
 *
 * @class NoResponseError
 * @constructor
 */
function NoResponseError() {  
  Error.call(this);
  this.name = 'NoResponseError';
  this.message = "No response from client.";

  Error.captureStackTrace(this, NoResponseError);
};

util.inherits(NoResponseError, Error);

module.exports = NoResponseError;
