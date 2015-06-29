module.exports = (function() {
  var WatchAuth = function(io) {
    this._io = io;
  }

  WatchAuth.prototype._distances = {};

  WatchAuth.prototype.startConnection = function() {
    this._io.on('connection', function(socket) {
      this._onConnected(socket);
      socket.on('disconnect', this._onDisconnected.bind(this));
      socket.on('response-distance', this._onReceiveDistance.bind(this));
    }.bind(this));
  }

  WatchAuth.prototype.auth = function(params, callback, timeout) {
    this._requestDistance(function(distance) {
      callback(this._checkPermission(params, distance));
    }.bind(this), timeout);
  }

  WatchAuth.prototype._checkPermission = function(params, distance) {
    var result = {result: true, debug: distance};
    return result;
  }

  WatchAuth.prototype._onConnected = function(socket) {
    console.log("client connected!!");
  }

  WatchAuth.prototype._onDisconnected = function() {
    console.log("client disconnected!!")
  }

  WatchAuth.prototype._onReceiveDistance = function(data) {
    this._distances[data['token']] = data['distance']
    console.log(data);
  }

  WatchAuth.prototype._generateToken = function() {
    return '1234abc'
  }

  WatchAuth.prototype._requestDistance = function(callback, timeout) {
    var token = this._generateToken()
    this._io.emit('request-distance', {token: token});

    setTimeout(function() {
      callback(this._distances[token]);
    }.bind(this), timeout);
  }

  return WatchAuth;
})();
