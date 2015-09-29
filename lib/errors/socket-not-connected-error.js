'use strict';

var util = require('util');

/**
 * クライアントsocketが接続していないことを表すエラー
 *
 * @class SocketNotConnectedError
 * @constructor
 */
function SocketNotConnectedError(id) {  
  Error.call(this);
  this.name = 'SocketNotConnectedError';
  this.message = id + " is not connected.";
  
  this.data = {
    id: id
  }

  Error.captureStackTrace(this, SocketNotConnectedError);
}

util.inherits(SocketNotConnectedError, Error);

module.exports = SocketNotConnectedError;
