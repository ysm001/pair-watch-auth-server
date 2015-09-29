'use strict';

let _io = null;
const _logger = require('./logger.js');
const RequestDispatcher = require('../request-dispatcher.js');

/**
 * socket.ioの簡易wrapperクラス
 *
 * @class SocketIO
 * @constructor
 * @param {SocketIO} io SocketIOオブジェクト
 */
const SocketIO = function(io) {
  _io = io;
  this.startConnection();
};

/**
 * 接続の受け入れを開始するメソッド
 *
 * @method startConnection
 * @param {Function} callback 接続受け入れ開始後に呼ばれるcallback
 * @returns {void}
 */
SocketIO.prototype.startConnection = function(callback) {
  _io.on('connection', function(socket) {
    _onConnected(socket);
    socket.on('disconnect', _onDisconnected.bind(this, socket));
    socket.on('register-id', _onRegisterId.bind(this, socket));
    if (callback) {callback(socket);}
  }.bind(this));
};

/**
 * クライアントにデータを送信するメソッド
 *
 * @method emit
 * @param {String} event イベント名
 * @param {String} data 送信するデータ
 * @returns {void}
 */
SocketIO.prototype.emit = function(event, data) {
  _io.emit(event, data);
};

/**
 * 接続済socketの配列を返すメソッド
 *
 * @method sockets
 * @return {[Socket]} sockets 接続済socketの配列
 */
SocketIO.prototype.sockets = function() {
  return _io.sockets.sockets;
};

/**
 * 指定したUser IDと紐付けられたsocketを返すメソッド
 *
 * @method socket
 * @param {String} uid User ID
 * @return {Socket} socket 指定したUser IDと紐付けられたsocket
 */
SocketIO.prototype.socket = function(uid) {
  const sockets = this.sockets();

  for (let i = 0, n = sockets.length; i < n; ++i) {
    if (sockets[i].handshake.user.id === uid) {
      return sockets[i];
    }
  }

  return null;
};

/**
 * 接続中の全socketを切断するメソッド
 *
 * @method disconnectAll
 * @returns {void}
 */
SocketIO.prototype.disconnectAll = function() {
  this.sockets().forEach(function(socket) {if (socket) {socket.disconnect(true);}});
};

/**
 * client接続時に呼ばれるcallbackメソッド
 *
 * @method _onConnected
 * @private
 * @param {Socket} socket 新たに接続したsocket
 * @returns {void}
 */
const _onConnected = function(socket) {
  socket.handshake.user = {};
  _logger.debug('client connected');
};

/**
 * client切断時に呼ばれるcallbackメソッド
 *
 * @method _onDisconnected
 * @private
 * @param {Socket} socket 切断されたsocket
 * @returns {void}
 */
const _onDisconnected = function(socket) {
  const id = socket.handshake.user.id || 'client';

  _logger.debug(id + ' disconnected');
};

/**
 * User IDとsocketの紐付けが行われた時に呼ばれるcallbackメソッド
 *
 * @method _onRegisterId
 * @private
 * @param {Socket} socket 紐付けを行うsocket
 * @param {Object} data User IDを含むObject
 * @param {String} data.id User ID
 * @returns {void}
 */
const _onRegisterId = function(socket, data) {
  socket.handshake.user.id = data.id;
  _logger.debug(data.id + ' is registered');
  RequestDispatcher.register(socket);
};

module.exports = SocketIO;
