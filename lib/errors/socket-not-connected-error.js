'use strict';

var util = require('util');

function SocketNotConnectedError(id) {  
  Error.call(this);
  this.name = 'SocketNotConnectedError';
  this.id = id;
  this.message = id + " is not connected.";

  Error.captureStackTrace(this, SocketNotConnectedError);
}

util.inherits(SocketNotConnectedError, Error);

module.exports = SocketNotConnectedError;
