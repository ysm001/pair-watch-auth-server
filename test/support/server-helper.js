module.exports = (function() {
  var config = require('../../config/server.json').development;
  var http = require('http');
  var port = config.port;

  var ServerHelper = function() {};

  ServerHelper.app = require('../../app');
  ServerHelper.app.set('port', port);

  ServerHelper.server = http.createServer(ServerHelper.app);
  ServerHelper.io = require('socket.io')(ServerHelper.server)

  ServerHelper.init = function() {
    ServerHelper.server.listen(port);
  }

  ServerHelper.waitForDisconnect = function(socketIO, done) {
    socketIO.disconnectAll();

    if (socketIO.sockets().length != 0) {
      setTimeout(ServerHelper.waitForDisconnect.bind(this, socketIO, done), 100);
    } else {
      done();
    }
  }

  return ServerHelper;
})();
