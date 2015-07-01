var express = require('express');
var WatchAuth = require('../models/watch-auth.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body, function(result) {res.send(result)}, 1000);
    }
  };
}
