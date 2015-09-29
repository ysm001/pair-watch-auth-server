'use strict';

const _logger = require('./supports/logger.js');

/**
 * $BDLCN$NAw?.$r9T$&%/%i%9(B 
 *
 * @class NotificationDispatcher
 * @constructor
 */
const NotificationDispatcher = function() {};

/**
 * $B%f!<%6$KDLCN$rAw$k%a%=%C%I(B
 *
 * @method notify
 * @param {Socket} socket $BDLCN@h(Bsocket
 * @param {Notification} notification $BDLCNFbMF(B
 */
NotificationDispatcher.dispatch = function(socket, notification) {
  socket.emit('notification', {notification: notification});
  _logger.debug('notify [' + notification.type + ']' + '->' + socket.handshake.user.id);
};

module.exports = NotificationDispatcher;
