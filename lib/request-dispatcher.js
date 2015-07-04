var Puid = require('puid');

module.exports = (function() {
  var _responses = {};
  var _maxTimeout = 65536;

  /**
   * Clientへのリクエスト送信を行うクラス
   *
   * @class RequestDispatcher
   * @constructor
   */
  var RequestDispatcher = function() {}

  /**
   * クライアントへのリクエスト送信を行い、結果を受け取るメソッド
   *
   * 一定時間以内に返答された結果全てを配列としてcallbackに渡す
   *
   * @method dispatch
   * @static
   * @param {Socket} socket 送信先socket
   * @param {String} request リクエスト内容 
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間
   */
  RequestDispatcher.dispatch = function(socket, request, callback, timeout) {
    var token = (new Puid()).generate();
    if (timeout > _maxTimeout) throw "timeout is too long. (> 65536)"

    if(socket.listeners('response').length == 0) {
      socket.on('response', _onReceiveResponse.bind(this));
    }
    socket.emit('request', {token: token, request: request});

    setTimeout(function() {
      callback(_responses[token]);
      delete _responses[token]
    }.bind(this), timeout);
  }

  /**
   * レスポンスを受け取った際に呼ばれるcallback
   *
   * @method _onReceiveResponse
   * @private
   * @param {Object} res レスポンス
   */
  var _onReceiveResponse = function(res) {
    _responses[res.token] = _responses[res.token] || [];
    _responses[res.token].push(res.value);
    console.log(res);
  }

  return RequestDispatcher;
})();
