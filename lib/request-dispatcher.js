'use strict';

const TokenGenerator = require('./supports/token-generator.js');
const NoResponseError = require('./errors/no-response-error.js');
const InvalidTokenError = require('./errors/invalid-token-error.js');
const Promise = require('bluebird');
const _responses = {};
const _maxTimeout = 65536;
const _logger = require('./supports/logger.js');

/**
 * Clientへのリクエスト送信を行うクラス
 *
 * @class RequestDispatcher
 * @constructor
 */
const RequestDispatcher = function() {};

/**
 * クライアントへのリクエスト送信を行い、結果を受け取るメソッド
 *
 * 一定時間以内に返答された結果全てを配列としてcallbackに渡す
 *
 * @method dispatch
 * @static
 * @param {Socket} socket 送信先socket
 * @param {String} request リクエスト内容
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
RequestDispatcher.dispatch = function(socket, request, timeout) {
  const token = TokenGenerator.generate();

  _checkTimeoutValidation(timeout);
  _resetResponse(token);

  socket.emit('request', {token: token, request: request});

  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(_popResponse(token));
    }, timeout);
  });
};

/**
 * socketをRequestDispatcherに登録するメソッド
 *
 * @method register
 * @static
 * @param {Socket} socket 登録するsocket
 * @returns {void}
 */
RequestDispatcher.register = function(socket) {
  if (socket.listeners('response').length === 0) {
    socket.on('response', _onReceiveResponse.bind(this));
  }
};

/**
 * HTTPリクエストをdispatchされたリクエストのレスポンスとして受け取るメソッド
 *
 * @method receiveHttpResponse
 * @static
 * @param {HTTPResponse} res HTTPレスポンス
 * @returns {void}
 */
RequestDispatcher.receiveHttpResponse = function(res) {
  _onReceiveResponse(res);
};

/**
 * レスポンスを受け取った際に呼ばれるcallback
 *
 * @method _onReceiveResponse
 * @private
 * @param {Object} res レスポンス
 * @returns {void}
 */
const _onReceiveResponse = function(res) {
  if (!_responses[res.token]) {
    _logger.debug('dropped');
    _logger.debug(res);
    return;
  }

  _responses[res.token].push(res.value);
};

const _popResponse = function(token) {
  const response = _responses[token];

  _clearResponse(token);
  _checkResponseValidation(response);

  return response;
};

const _clearResponse = function(token) {
  delete _responses[token];
};

const _resetResponse = function(token) {
  _clearResponse(token);
  _responses[token] = [];
};

const _checkTimeoutValidation = function(timeout) {
  if (timeout > _maxTimeout) {
    throw new Error('timeout is too long. (> 65536)');
  }
};

const _checkResponseValidation = function(response) {
  if (!response) {
    return Promise.reject(new InvalidTokenError());
  } /* else if (response.length === 0) {
    return Promise.reject(new NoResponseError());
  } */
};

module.exports = RequestDispatcher;
