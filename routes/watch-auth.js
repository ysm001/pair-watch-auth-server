var express = require('express');
var WatchAuth = require('../lib/watch-auth.js');
var AuthResultNotificator = require('../lib/auth-result-notificator.js')
var PermissionError = require('../lib/errors/permission-error.js');

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, 2000).then(function(result) {
        AuthResultNotificator.notify(watchAuth.socketIO(), req.body.id, req.body.permission, result.accessibility, result.requiredUsers, result.nearPermissionHolders)

        res.send({
          result: result.accessibility,
        });
      }).catch(function(err) {
        AuthResultNotificator.notify(watchAuth.socketIO(), req.body.id, req.body.permission, false, err.data.requiredUsers, err.data.nearPermissionHolders)

        res.send({
          result: false,
          error: err 
        });
      });
    }
  };
}
