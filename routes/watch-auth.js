var express = require('express');
var WatchAuth = require('../models/watch-auth.js');
var AuthResultNotificator = require('../lib/auth-result-notificator.js')

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, 2000).then(function(result) {
        AuthResultNotificator.notify(watchAuth.socketIO(), req.body.id, req.body.permission, result, result.requiredUsers, result.nearPermissionHolders)

        res.send({
          result: result.accessibility,
          // error: err,
          //'required-users': requiredUsers
        })
      });
    }
  };
}
