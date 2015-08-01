module.exports = (function() {
  var _logger = require('./logger.js');

  var NotificationDispatcher = function() {}

  NotificationDispatcher.dispatch = function(socket, notification) {
    socket.emit('notification', {notification: notification});
    _logger.debug("notify [" + notification.type + "]" + "->" + socket.handshake.user.id)
  }

  return NotificationDispatcher
})()
