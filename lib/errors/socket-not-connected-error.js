'use strict';

var util = require('util');

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
