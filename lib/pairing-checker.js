'use strict';

const RequestDispatcher = require('../lib/request-dispatcher.js');
const Promise = require('bluebird');
const PairingCheckError = require('./errors/pairing-check-error.js');

/**
 * ペアリングの状態を確認するクラス
 *
 * (サーバ側からはペアリングの状態確認リクエストを送るだけで、実際にペアリングの状態を確認するのはiOSアプリ側)
 *
 * @class PairingChecker
 * @constructor
 */
const PairingChecker = function() {};

/**
 * ペアリングの状態を確認するメソッド
 *
 * @method check
 * @static
 * @param {Socket} socket 確認先socket
 * @param {Integer} timeout レスポンス待機時間
 * @return {Promise} this
 */
PairingChecker.check = function(socket, timeout) {
  return _emitCheckPairingRequest(socket, timeout).then(function(response) {
    const result = response[0].result;

    if (!result) {
      return Promise.reject(new PairingCheckError());
    }

    return result;
  });
};

/**
 * ペアリングの状態を確認するリクエストを送るメソッド
 *
 * @method _emit
 * @private
 * @param {Socket} socket 送信先socket
 * @param {Integer} timeout レスポンス待機時間
 * @return {Promise} this
 */
const _emitCheckPairingRequest = function(socket, timeout) {
  return RequestDispatcher.dispatch(socket, 'check-pairing', timeout);
};

module.exports = PairingChecker;
