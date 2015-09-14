'use strict';

var util = require('util');

function RecordNotFoundError(modelName, condition) {  
  Error.call(this);
  this.name = 'RecordNotFoundError';
  this.message = modelName + " Not Found: " + JSON.stringify(condition);

  this.data = {
    modelName: modelName,
    condition: condition
  };

  Error.captureStackTrace(this, RecordNotFoundError);
}

util.inherits(RecordNotFoundError, Error);

module.exports = RecordNotFoundError;
