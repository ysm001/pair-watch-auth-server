var SocketIO = require('../lib/socket-io.js');
var RequestDispatcher = require('../lib/request-dispatcher.js');
var Puid = require('puid');

module.exports = (function() {
  var _socketIO = null;
  var _requestDispatcher = null;

  var WatchAuth = function(io) {
    _socketIO = new SocketIO(io);
  }

  WatchAuth.prototype.startConnection = function() {
    _socketIO.startConnection();
  }

  WatchAuth.prototype.auth = function(params, callback, timeout) {
    var sockets = _socketIO.sockets.toArray();
    RequestDispatcher.dispatch(sockets, 'distance', function(response) {
      callback(response);
    }, 1000);
  }

  var _checkPermission = function(params, distance) {
    var result = {result: true, debug: distance};
    return result;
  }

  return WatchAuth;
})();
