'use strict';

var util = require('util');

/**
 * ペアリングの確認に失敗したことを表すエラー
 *
 * @class ParingCheckError
 * @constructor
 */
function PairingCheckError() {  
  Error.call(this);
  this.name = 'PairingCheckError';
  this.message = 'Pairing check failed.';
  
  Error.captureStackTrace(this, PairingCheckError);
}

util.inherits(PairingCheckError, Error);

module.exports = PairingCheckError;
