var express = require('express');
var WatchAuth = require('../models/watch-auth.js');
var NotificationDispatcher = require('../lib/notification-dispatcher.js')
var User = require('../models/user.js')
require('date-utils')

module.exports = function(io) {
  var watchAuth = new WatchAuth(io);

  var notifyResults = function(socketIO, id, permission, result, requiredUsers, nearPermissionHolderIds) {
    if (!nearPermissionHolderIds) return

    var userSocket = socketIO.socket(id)
    var requiredUsersSockets = requiredUsers.map(function(user) {return socketIO.socket(user.deviceId)})
    var nearPermissionHoldersSockets = nearPermissionHolderIds.map(function(user) {return socketIO.socket(user)})

    var date = new Date();
    var dateString = date.toFormat("YYYY/MM/DD HH24:MI");

    if (!result) {
      requiredUsersSockets.forEach(function(socket) {
        if (!socket) return;

        User.findOne({deviceId: id}, function(err, user) {
          NotificationDispatcher.dispatch(socket, {
            type: 'permission-violation',
            data: {
              violator: {id: user.deviceId, name: user.name},
              date: dateString,
              permission: permission
            }
          })
        })
      })
    } else {
      nearPermissionHoldersSockets.forEach(function(socket) {
        if (!socket) return;

        User.findOne({deviceId: id}, function(err, user) {
          NotificationDispatcher.dispatch(socket, {
            type: 'permission-used',
            data: {
              user: {id: user.deviceId, name: user.name},
              date: dateString,
              permission: permission
            }
          })
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

    NotificationDispatcher.dispatch(userSocket, {
      type: type,
      data: data
    })
  }

  return {
    auth: function(req, res) {
      watchAuth.auth(req.body.id, req.body.permission, function(err, result, requiredUsers, nearPermissionHolderIds) {
        if (err) console.log(err);

        notifyResults(watchAuth.socketIO(), req.body.id, req.body.permission, result, requiredUsers, nearPermissionHolderIds)

        res.send({
          result: result,
          error: err,
          'required-users': requiredUsers
        })
      }, 2000);
    }
  };
}
