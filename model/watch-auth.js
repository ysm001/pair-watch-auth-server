module.exports = (function() {
  var _distances = {};
  var _io = null;

  var WatchAuth = function(io) {
    _io = io;
  }

  WatchAuth.prototype.startConnection = function() {
    _io.on('connection', function(socket) {
      _onConnected(socket);
      socket.on('disconnect', _onDisconnected.bind(this));
      socket.on('response-distance', _onReceiveDistance.bind(this));
    }.bind(this));
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

  var _onConnected = function(socket) {
    console.log("client connected!!");
  }

  var _onDisconnected = function() {
    console.log("client disconnected!!")
  }

  var _onReceiveDistance = function(data) {
    _distances[data['token']] = data['distance']
    console.log(data);
  }

  var _generateToken = function() {
    return '1234abc'
  }

  var _requestDistance = function(callback, timeout) {
    var token = _generateToken()
    _io.emit('request-distance', {token: token});

    setTimeout(function() {
      callback(_distances[token]);
    }.bind(this), timeout);
  }

  return WatchAuth;
})();
