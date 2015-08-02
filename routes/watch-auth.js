var express = require('express');
var WatchAuth = require('../models/watch-auth.js');
var AuthResultNotificator = require('../lib/auth-result-notificator.js')

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, function(err, result, requiredUsers, nearPermissionHolderIds) {
        if (err) console.log(err);

        AuthResultNotificator.notify(watchAuth.socketIO(), req.body.id, req.body.permission, result, requiredUsers, nearPermissionHolderIds)

        res.send({
          result: result,
          error: err,
          'required-users': requiredUsers
        })
      }, 2000);
    }
  };
}
