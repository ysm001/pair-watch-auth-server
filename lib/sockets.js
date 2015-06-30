module.exports = (function() {
  var Sockets = function() {}
  var _sockets = {}

  Sockets.prototype.findIdBySocket = function(socket) {
    for(var id in _sockets) {
      if (_sockets[id].id == socket.id) return id;
    }

    return null;
  }

  Sockets.prototype.add = function(socket, id) {
    if (!_sockets[id]) {
      _sockets[id] = socket;
      console.log(id + " is registered.");
    } else {
      console.log("warning: socket[" + id + "]is already existing.");
    }
  }

  Sockets.prototype.remove = function(socket) {
    var id = this.findIdBySocket(socket);

    if (id) {
      delete _sockets[id];
      console.log(id + " is unregistered.");
    } else {
      console.log("warning: socket[" + id + "] is not found.");
    }
  }
  
  return Sockets;
})();
