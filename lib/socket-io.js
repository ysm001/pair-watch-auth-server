module.exports = (function() {
  var _distances = {};
  var _io = null;

  var SocketIO = function(io) {
    _io = io;
  }

  SocketIO.prototype.startConnection = function(callback) {
    _io.on('connection', function(socket) {
      _onConnected(socket);
      socket.on('disconnect', _onDisconnected.bind(this));
      callback(socket);
    }.bind(this));
  }

  SocketIO.prototype.emit = function(request, data) {
    _io.emit(request, data);
  }

  var _onConnected = function(socket) {
    console.log("client connected!!");
  }

  var _onDisconnected = function() {
    console.log("client disconnected!!")
  }

  return SocketIO;
})();
