'use strict';

const _logger = require('./supports/logger.js');

/**
 * 通知の送信を行うクラス 
 *
 * @class NotificationDispatcher
 * @constructor
 */
const NotificationDispatcher = function() {};

/**
 * ユーザに通知を送るメソッド
 *
 * @method notify
 * @param {Socket} socket 通知先socket
 * @param {Notification} notification 通知内容
 */
NotificationDispatcher.dispatch = function(socket, notification) {
  socket.emit('notification', {notification: notification});
  _logger.debug('notify [' + notification.type + ']' + '->' + socket.handshake.user.id);
};

module.exports = NotificationDispatcher;
