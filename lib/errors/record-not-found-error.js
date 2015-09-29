'use strict';

var util = require('util');

/**
 * DB上にデータが存在しなかったことを表すエラー
 *
 * @class RecordNotFoundError
 * @constructor
 */
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
