'use strict';

const _logger = require('./logger.js');
const NotificationDispatcher = function() {};

NotificationDispatcher.dispatch = function(socket, notification) {
  socket.emit('notification', {notification: notification});
  _logger.debug('notify [' + notification.type + ']' + '->' + socket.handshake.user.id);
};

module.exports = NotificationDispatcher;
