var express = require('express');
var WatchAuth = require('../models/watch-auth.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, function(err, result, requiredUsers) {
        if (err) console.log(err);

        res.send({
          result: result,
          error: err,
          'required-users': requiredUsers
        })
      }, 1500);
    }
  };
}
