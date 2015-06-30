var express = require('express');
var WatchAuth = require('../models/watch-auth.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);
  watchAuth.startConnection();

  return {
    auth: function(req, res) {
      watchAuth.auth(null, function(result) {res.send(result)}, 1000);
    }
  };
}
