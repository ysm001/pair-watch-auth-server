'use strict';

const util = require('util');

function InvalidTokenError() {  
  Error.call(this);
  this.name = 'InvalidTokenError';
  this.message = "Invalid token.";
};

util.inherits(InvalidTokenError, Error);

module.exports = InvalidTokenError;
