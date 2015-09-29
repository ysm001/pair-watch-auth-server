module.exports = (function() {
  var config = require('../../config/server.json').test;
  var http = require('http');
  var port = config.port;

  var ServerHelper = function() {};

  ServerHelper.app = require('../../app');
  ServerHelper.app.set('port', port);
  var db = require('./db.js');

  ServerHelper.server = http.createServer(ServerHelper.app);
  ServerHelper.io = require('socket.io')(ServerHelper.server)

  ServerHelper.init = function() {
    ServerHelper.server.listen(port);
  }

  ServerHelper.destroy = function(done) {
    ServerHelper.server.close(function () {
      process.exit(0);
      done();
    });
  }

  ServerHelper.waitForDisconnect = function(socketIO, done) {
    socketIO.disconnectAll();

    if (socketIO.sockets().length != 0) {
      setTimeout(ServerHelper.waitForDisconnect.bind(this, socketIO, done), 100);
    } else {
      done();
    }
  }

  ServerHelper.port = function() {
    return port;
  }

  return ServerHelper;
})();
