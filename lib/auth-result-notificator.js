module.exports = (function() {
  require('date-utils')
  var NotificationDispatcher = require('./notification-dispatcher.js');
  var AuthResultNotificator = function() {}
  var User = require('../models/user.js')

  AuthResultNotificator.notify = function(socketIO, id, permission, result, requiredUsers, nearPermissionHolders) {
    if (!nearPermissionHolders) return

    var userSocket = socketIO.socket(id)
    var targetUsers = result ? nearPermissionHolders : requiredUsers
    var targetSockets = targetUsers.map(function(user) {return socketIO.socket(user.deviceId)})
    var type = result ? 'permission-used' : 'permission-violation'

    _notifyToAuthorizers(type, targetSockets, id, permission)
    _notifyAuthResult(socketIO, userSocket, result, targetUsers)
  }

  var _notifyToAuthorizers = function(type, sockets, id, permission) {
    var date = new Date();
    var dateString = date.toFormat("YYYY/MM/DD HH24:MI");

    User.findOne({deviceId: id}, function(err, user) {
      sockets.forEach(function(socket) {
        if (!socket) return;

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

  var _notifyAuthResult = function(socketIO, userSocket, result, targetUsers) {
    var type = result ? 'auth-successed' : 'auth-failed'
    var data = _makeFormattedDataFromUsers(socketIO, targetUsers) 

    NotificationDispatcher.dispatch(userSocket, {
      type: type,
      data: data
    })
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
