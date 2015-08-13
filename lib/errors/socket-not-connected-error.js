'use strict';

var util = require('util');

function SocketNotConnectedError(id) {  
  Error.call(this);
  this.id = id;
  this.message = id + " is not connected.";

  Error.captureStackTrace(this, SocketNotConnectedError);
}

util.inherits(SocketNotConnectedError, Error);

module.exports = SocketNotConnectedError;
