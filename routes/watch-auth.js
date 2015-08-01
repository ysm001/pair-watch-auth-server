var express = require('express');
var WatchAuth = require('../models/watch-auth.js');
var NotificationDispatcher = require('../lib/notification-dispatcher.js')

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  var notifyResults = function(socketIO, id, result, requiredUsers, nearPermissionHolderIds) {
    if (!nearPermissionHolderIds) return

    var userSocket = socketIO.socket(id)
    var requiredUsersSockets = requiredUsers.map(function(user) {return socketIO.socket(user.deviceId)})
    var nearPermissionHoldersSockets = nearPermissionHolderIds.map(function(user) {return socketIO.socket(user)})

    if (!result) {
      requiredUsersSockets.forEach(function(socket) {
        if (!socket) return;

        NotificationDispatcher.dispatch(socket, {
          type: 'permission-violation',
          data: {
            violator: id,
            permission: 'dummy'
          }
        })
      })
    } else {
      nearPermissionHoldersSockets.forEach(function(socket) {
        if (!socket) return;

        NotificationDispatcher.dispatch(socket, {
          type: 'permission-used',
          data: {
            user: id,
            permission: 'dummy'
          }
        })
      })
    }

    var type = result ? 'auth-successed' : 'auth-failed'
    var users = null
    if (!result) {
      users = requiredUsers
    } else {
      var users = requiredUsers.filter(function(user) {
        for (var i = 0, n = nearPermissionHolderIds.length; i < n; ++i) {
          if (nearPermissionHolderIds[i] == user.deviceId) return true
        }

        return false
      })
    }

    data = users.map(function(user) {
      return {
        name: user.name,
        id: user.deviceId,
        iconUrl: null,
        connected: (socketIO.socket(user.deviceId) != null)
      }
    })

    console.log(data)
    NotificationDispatcher.dispatch(userSocket, {
      type: type,
      data: data
    })
  }

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, function(err, result, requiredUsers, nearPermissionHolderIds) {
        if (err) console.log(err);

        notifyResults(watchAuth.socketIO(), req.body.id, result, requiredUsers, nearPermissionHolderIds)

        res.send({
          result: result,
          error: err,
          'required-users': requiredUsers
        })
      }, 2000);
    }
  };
}
