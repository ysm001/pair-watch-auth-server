module.exports = (function() {
  require('date-utils')
  var NotificationDispatcher = require('./notification-dispatcher.js');
  var AuthResultNotificator = function() {}
  var User = require('../models/user.js')

  AuthResultNotificator.notify = function(socketIO, id, permission, result, requiredUsers, nearPermissionHolderIds) {
    if (!nearPermissionHolderIds) return

    var userSocket = socketIO.socket(id)
    var requiredUsersSockets = requiredUsers.map(function(user) {return socketIO.socket(user.deviceId)})
    var nearPermissionHoldersSockets = nearPermissionHolderIds.map(function(user) {return socketIO.socket(user)})

    if (!result) {
      _notifyToAuthorizers('permission-violation', requiredUsersSockets, id, permission)
    } else {
      _notifyToAuthorizers('permission-used', nearPermissionHoldersSockets, id, permission)
    }

    _notifyAuthResult(userSocket, socketIO, result, requiredUsers, nearPermissionHolderIds)
  }

  var _notifyToAuthorizers = function(type, sockets, id, permission) {
    var date = new Date();
    var dateString = date.toFormat("YYYY/MM/DD HH24:MI");

    sockets.forEach(function(socket) {
      if (!socket) return;

      User.findOne({deviceId: id}, function(err, user) {
        NotificationDispatcher.dispatch(socket, {
          type: type,
          data: {
            user: {id: user.deviceId, name: user.name},
            date: dateString,
            permission: permission
          }
        })
      })
    })
  }

  var _notifyAuthResult = function(userSocket, socketIO, result, requiredUsers, nearPermissionHolderIds) {
    var type = result ? 'auth-successed' : 'auth-failed'
    var users = _makeUsersDataFromResult(result, requiredUsers, nearPermissionHolderIds)
    var data = _makeFormattedDataFromUsers(socketIO, users) 

    NotificationDispatcher.dispatch(userSocket, {
      type: type,
      data: data
    })
  }

  var _makeUsersDataFromResult = function(result, requiredUsers, nearPermissionHolderIds) {
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

    return users
  }

  var _makeFormattedDataFromUsers = function(socketIO, users) {
    return users.map(function(user) {
      return {
        name: user.name,
        id: user.deviceId,
        iconUrl: null,
        connected: (socketIO.socket(user.deviceId) != null)
      }
    })
  }
  
  return AuthResultNotificator
})()
