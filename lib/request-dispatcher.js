var Puid = require('puid');

module.exports = (function() {
  var _responses = {};

  var RequestDispatcher = function() {}

  RequestDispatcher.prototype.dispatch = function(sockets, request, callback, timeout) {
    var token = (new Puid()).generate();

    sockets.forEach(function(socket) {
      if(socket.listeners('response').length == 0) {
        socket.on('response', _onReceiveResponse.bind(this));
      }
      socket.emit('request', {token: token, request: request});
    });

    setTimeout(function() {
      callback(_responses[token]);
      delete _responses[token]
    }.bind(this), timeout);
  }

  var _onReceiveResponse = function(res) {
    _responses[res.token] = res.value
    console.log(res);
  }

  return RequestDispatcher;
})();
