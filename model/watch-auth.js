var SocketIO = require('../lib/socket-io.js');
var Puid = require('puid');

module.exports = (function() {
  var _distances = {};
  var _socketIO = null;

  var WatchAuth = function(io) {
    _socketIO = new SocketIO(io);
  }

  WatchAuth.prototype.startConnection = function() {
    _socketIO.startConnection(function(socket) {
      socket.on('response-distance', _onReceiveDistance.bind(this));
    });
  }

  WatchAuth.prototype.auth = function(params, callback, timeout) {
    _requestDistance.call(this, function(distance) {
      callback(_checkPermission(params, distance));
    }.bind(this), timeout);
  }

  var _checkPermission = function(params, distance) {
    var result = {result: true, debug: distance};
    return result;
  }

  var _onReceiveDistance = function(data) {
    _distances[data.token] = data.distance
    console.log(data);
  }

  var _requestDistance = function(callback, timeout) {
    var token = (new Puid()).generate();
    _socketIO.emit('request-distance', {token: token});

    setTimeout(function() {
      callback(_distances[token]);
      delete _distances[token]
    }.bind(this), timeout);
  }

  return WatchAuth;
})();
