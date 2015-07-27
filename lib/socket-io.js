module.exports = (function() {
  var _io = null;

  /**
   * socket.ioの簡易wrapperクラス
   *
   * @class SocketIO
   * @constructor
   */
  var SocketIO = function(io) {
    _io = io;
    this.startConnection();
  }

  /**
   * 接続の受け入れを開始するメソッド
   *
   * @method startConnection
   * @param {Function} callback 接続受け入れ開始後に呼ばれるcallback
   */
  SocketIO.prototype.startConnection = function(callback) {
    _io.on('connection', function(socket) {
      _onConnected(socket);
      socket.on('disconnect', _onDisconnected.bind(this, socket));
      socket.on('register-id', _onRegisterId.bind(this, socket));
      if (callback) callback(socket);
    }.bind(this));
  }

  /**
   * クライアントにデータを送信するメソッド
   *
   * @method emit
   * @param {String} event イベント名
   * @param {String} data 送信するデータ
   */
  SocketIO.prototype.emit = function(event, data) {
    _io.emit(event, data);
  }

  /**
   * 接続済socketの配列を返すメソッド
   *
   * @method sockets
   * @return {[Socket]} sockets 接続済socketの配列
   */
  SocketIO.prototype.sockets = function() {
    return _io.sockets.sockets;
  }

  /**
   * 指定したUser IDと紐付けられたsocketを返すメソッド
   *
   * @method socket
   * @param {String} uid User ID
   * @return {Socket} socket 指定したUser IDと紐付けられたsocket
   */
  SocketIO.prototype.socket = function(uid) {
    var sockets = this.sockets();
    for (var i = 0, n = sockets.length; i < n; ++i) {
      if (sockets[i].handshake.user.id == uid) return sockets[i];
    }

    return null;
  }
  
  /**
   * 接続中の全socketを切断するメソッド
   *
   * @method disconnectAll
   */
  SocketIO.prototype.disconnectAll = function() {
    var sockets = this.sockets();
    sockets.forEach(function(socket) {if(socket) socket.disconnect(true);});
  }

  /**
   * client接続時に呼ばれるcallback
   *
   * @method _onConnected
   * @private
   * @param {Socket} socket 新たに接続したsocket
   */
  var _onConnected = function(socket) {
    socket.handshake.user = {};
    console.log("client connected!!");
  }

  /**
   * client切断時に呼ばれるcallback
   *
   * @method _onDisconnected
   * @private
   * @param {Socket} socket 切断されたsocket
   */
  var _onDisconnected = function(socket) {
    console.log("client disconnected!!")
  }

  /**
   * User IDとsocketの紐付けが行われた時に呼ばれるcallback
   *
   * @method _onRegisterId
   * @private
   * @param {Socket} socket 紐付けを行うsocket
   * @param {Object} data User IDを含むObject
   * @param {String} data.id User ID
   */
  var _onRegisterId = function(socket, data) {
    socket.handshake.user.id = data.id;
    console.log(data.id + " is registered");
  }

  return SocketIO;
})();
