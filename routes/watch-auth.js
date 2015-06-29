var express = require('express');
var WatchAuth = require('../model/watch-auth.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);
  watchAuth.startConnection();

  return {
    auth: function(req, res) {
      watchAuth.requestDistance(function(distance) {
        res.send(distance);
      }, 1000);
    }
  };
}
