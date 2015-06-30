var Sockets = require('./sockets.js');

module.exports = (function() {
  var _io = null;
  var sockets = new Sockets();

  var SocketIO = function(io) {
    _io = io;
  }

  SocketIO.prototype.startConnection = function(callback) {
    _io.on('connection', function(socket) {
      _onConnected(socket);
      socket.on('disconnect', _onDisconnected.bind(this, socket));
      socket.on('register-id', _onRegisterId.bind(this, socket));
      callback(socket);
    }.bind(this));
  }

  SocketIO.prototype.emit = function(request, data) {
    _io.emit(request, data);
  }

  var _onConnected = function(socket) {
    console.log("client connected!!");
  }

  var _onDisconnected = function(socket) {
    sockets.remove(socket);
    console.log("client disconnected!!")
  }

  var _onRegisterId = function(socket, data) {
    sockets.add(socket, data.id);
  }

  return SocketIO;
})();
