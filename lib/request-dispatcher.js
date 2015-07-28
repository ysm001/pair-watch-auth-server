var TokenGenerator = require('./token-generator.js');

module.exports = (function() {
  var _responses = {};
  var _maxTimeout = 65536;
  
  var _logger = require('./logger.js');

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
   * @param {Integer} constToken (デバッグ用) constTokenをトークンに利用
   */
  RequestDispatcher.dispatch = function(socket, request, callback, timeout, constToken) {
    var token = constToken || TokenGenerator.generate();
    if (timeout > _maxTimeout) throw "timeout is too long. (> 65536)"

    _clearResponse.call(this, token);

    _responses[token] = [];
    socket.emit('request', {token: token, request: request});

    setTimeout(function() {
      callback(_responses[token]);
      _clearResponse.call(this, token);
    }.bind(this), timeout);
  }

  RequestDispatcher.register = function(socket) {
    if(socket.listeners('response').length == 0) {
      socket.on('response', _onReceiveResponse.bind(this));
    }
  }

  /**
   * レスポンスを受け取った際に呼ばれるcallback
   *
   * @method _onReceiveResponse
   * @private
   * @param {Object} res レスポンス
   */
  var _onReceiveResponse = function(res) {
    if (!_responses[res.token]) {
      _logger.debug("dropped");
      _logger.debug(res);
      return;
    }
    _responses[res.token].push(res.value);
    _logger.debug(res);
  }

  var _clearResponse = function(token) {
    delete _responses[token]
  }

  return RequestDispatcher;
})();
