module.exports = (function() {
  var _io = null;

  var SocketIO = function(io) {
    _io = io;
    this.startConnection();
  }

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

  SocketIO.prototype.sockets = function() {
    return _io.sockets.sockets;
  }

  var _onConnected = function(socket) {
    socket.handshake.user = {};
    console.log("client connected!!");
  }

  var _onDisconnected = function(socket) {
    console.log("client disconnected!!")
  }

  var _onRegisterId = function(socket, data) {
    socket.handshake.user.id = data.id;
  }

  return SocketIO;
})();
