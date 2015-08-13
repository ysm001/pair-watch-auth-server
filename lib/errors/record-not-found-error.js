'use strict';

var util = require('util');

function RecordNotFoundError(modelName, condition) {  
  Error.call(this);
  this.name = 'RecordNotFoundError';
  this.modelName = modelName;
  this.condition = condition
  this.message = modelName + " Not Found: " + JSON.stringify(condition);

  Error.captureStackTrace(this, RecordNotFoundError);
}

util.inherits(RecordNotFoundError, Error);

module.exports = RecordNotFoundError;
