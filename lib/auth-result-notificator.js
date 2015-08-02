module.exports = (function() {
  var NotificationDispatcher = require('./notification-dispatcher.js');
  var AuthResultNotificator = function() {}

  AuthResultNotificator.notify(sockets, result, requiredUsers, nearPermissionHolderIds) = function() {
    for (var scoket in sockets) {
      var type = result ? 'auth-successed' : 'auth-failed'
      var data = result ? nearPermissionHolderIds : requiredUsers
      NotificationDispatcher.dispatch(socket, {
        type: type,
        data: data
      })
    }
  }

  return AuthResultNotificator
})()
