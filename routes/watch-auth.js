var express = require('express');
var WatchAuth = require('../models/watch-auth.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body, function(err, result, requiredUsers) {
        res.send({
          result: result,
          error: err,
          'required-users': requiredUsers
        })
      }, 1000);
    }
  };
}
