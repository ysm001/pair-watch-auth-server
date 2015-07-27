var RequestDispatcher = require('../lib/request-dispatcher.js');
var async = require('async')

module.exports = (function() {
  /**
   * ペアリングの状態を確認するクラス
   *
   * (サーバ側からはペアリングの状態確認リクエストを送るだけで、実際にペアリングの状態を確認するのはiOSアプリ側)
   *
   * @class PairingChecker
   * @constructor
   */
  PairingChecker = function() {}

  /**
   * ペアリングの状態を確認するメソッド
   *
   * @method check
   * @static
   * @param {Socket} socket 確認先socket
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間
   */
  PairingChecker.check = function(socket, callback, timeout) {
    var tasks = [
      function(next) {
        _emitCheckPairingRequest(socket, next, timeout);
      },
      function(response, next) {
        var err = null;

        if (!response) err = "invalid token";
        else if (response.length == 0) err = "no response";
        // else if (response.length > 1 ) err = "too many response";

        next(err, response);
      }
    ];

    async.waterfall(tasks, function(err, response) {
      console.log(err)
      callback(err, response[0].result);
    });
  }

  /**
   * ペアリングの状態を確認するリクエストを送るメソッド
   *
   * @method _emit
   * @private
   * @param {Socket} socket 送信先socket
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間
   */
   var _emitCheckPairingRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'check-pairing', function(response) {
      callback(null, response);
    }, timeout, 22222/* debug */);
  }

  return PairingChecker;
})();
