module.exports = (function() {
  var WatchAuth = function(io) {
    this.io = io;
  }

  WatchAuth.prototype.distances = {};

  WatchAuth.prototype.onConnected = function(socket) {
    console.log("client connected!!");
  }

  WatchAuth.prototype.onDisconnected = function() {
    console.log("client disconnected!!")
  }

  WatchAuth.prototype.onReceiveDistance = function(data) {
    this.distances[data['token']] = data['distance']
    console.log(data);
  }

  WatchAuth.prototype.requestDistance = function(callback, timeout) {
    var token = '1234abc'
    this.io.emit('request-distance', {token: token});

    setTimeout(function() {
      callback(this.distances[token]);
    }.bind(this), timeout);
  }

  WatchAuth.prototype.startConnection = function() {
    this.io.on('connection', function(socket) {
      this.onConnected(socket);
      socket.on('disconnect', this.onDisconnected.bind(this));
      socket.on('response-distance', this.onReceiveDistance.bind(this));
    }.bind(this));
  }

  return WatchAuth;
})();
