module.exports = (function() {
  var Auth = function(io) {
    this.io = io;
  }

  Auth.prototype.distances = {};

  Auth.prototype.onConnected = function(socket) {
    console.log("client connected!!");
  }

  Auth.prototype.onDisconnected = function() {
    console.log("client disconnected!!")
  }

  Auth.prototype.onReceiveDistance = function(data) {
    this.distances[data['token']] = data['distance']
    console.log(data);
  }

  Auth.prototype.requestDistance = function(callback, timeout) {
    var token = '1234abc'
    this.io.emit('request-distance', {token: token});

    setTimeout(function() {
      callback(this.distances[token]);
    }.bind(this), timeout);
  }

  Auth.prototype.startConnection = function() {
    this.io.on('connection', function(socket) {
      this.onConnected(socket);
      socket.on('disconnect', this.onDisconnected.bind(this));
      socket.on('response-distance', this.onReceiveDistance.bind(this));
    }.bind(this));
  }

  return Auth;
})();
