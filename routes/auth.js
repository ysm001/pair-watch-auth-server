var express = require('express');

module.exports = function(io) {
  var distances = {};
  io.on('connection', function(socket) {
    console.log("client connected!!");
    socket.on('disconnect', function() {
      console.log("client disconnected!!")
    });

    socket.on('response-distance', function(data) {
      distances[data['token']] = data['distance']
      console.log(data);
    });
  });

  return {
    check: function(req, res) {
      var token = '1234abc'
      io.emit('request-distance', {token: token});

      setTimeout(function() {
        res.send(distances[token]);
      }, 1000);
    }
  };
}
