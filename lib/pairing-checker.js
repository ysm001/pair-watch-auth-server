'use strict';

const RequestDispatcher = require('../lib/request-dispatcher.js');
const async = require('async');
const _logger = require('./logger.js');
const Promise = require('bluebird')

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
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
PairingChecker.check = function(socket, timeout) {
  return _emitCheckPairingRequest(socket, timeout).then(function(response) {
    if (!response) {
      return Promise.reject(Error('invalid token'));
    } else if (response.length === 0) {
      return Promise.reject(Error('no response'));
    }

    const result = response[0].result

    if (!result) {
      return Promise.reject(Error('pairign check is failed'));
    }

    return result;
  })
};

/**
 * ペアリングの状態を確認するリクエストを送るメソッド
 *
 * @method _emit
 * @private
 * @param {Socket} socket 送信先socket
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
const _emitCheckPairingRequest = function(socket, timeout) {
  return RequestDispatcher.dispatch(socket, 'check-pairing', timeout);
};

module.exports = PairingChecker;
