var Sockets = require('./sockets.js');

module.exports = (function() {
  var _io = null;

  var SocketIO = function(io) {
    _io = io;
    this.startConnection();
  }

  SocketIO.prototype.sockets = new Sockets();

  SocketIO.prototype.startConnection = function(callback) {
    _io.on('connection', function(socket) {
      _onConnected(socket);
      socket.on('disconnect', _onDisconnected.bind(this, socket));
      socket.on('register-id', _onRegisterId.bind(this, socket));
      if (callback) callback(socket);
    }.bind(this));
  }

  SocketIO.prototype.emit = function(request, data) {
    _io.emit(request, data);
  }

  SocketIO.prototype.on = function(event, callback) {
    _io.sockets.on(event, callback);
  }

  var _onConnected = function(socket) {
    console.log("client connected!!");
  }

  var _onDisconnected = function(socket) {
    this.sockets.remove(socket);
    console.log("client disconnected!!")
  }

  var _onRegisterId = function(socket, data) {
    this.sockets.add(socket, data.id);
  }

  return SocketIO;
})();
