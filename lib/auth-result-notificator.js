'use strict';

require('date-utils');
const NotificationDispatcher = require('./notification-dispatcher.js');
const User = require('../models/user.js');

/**
 * 認証結果を通知するクラス 
 *
 * @class AuthResultNotificator
 * @constructor
 */
const AuthResultNotificator = function() {};

/**
 * ユーザに認証結果を通知するメソッド
 *
 * @method notify
 * @param {SocketIO} socketIO 接続済みSocketIOオブジェクト
 * @param {String} id 送付先のユーザID
 * @param {String} permission 要求された権限
 * @param {[User]} requiredUsers 認証に必要とされる権限保持者 (認証結果がfalseの場合、引数idで指定されたユーザに情報が通知されます)
 * @param {[User]} nearPermissionHolders 自分の周りに居る権限保持者 (認証結果がtrueの場合、引数idで指定されたユーザに情報が通知されます)
 */
AuthResultNotificator.notify = function(socketIO, id, permission, result, requiredUsers, nearPermissionHolders) {
  const userSocket = socketIO.socket(id);

  if (!userSocket) {return;}
  const targetUsers = _getTargetUsers(result, requiredUsers, nearPermissionHolders);
  const targetSockets = _getTargetSockets(socketIO, targetUsers);
  const type = _getNotificationType(result);

  _notifToAuthorizers(type, targetSockets, id, permission);
  _notifyAuthResult(socketIO, userSocket, result, targetUsers);
};

const _notifToAuthorizers = function(type, sockets, id, permission) {
  const date = new Date();
  const dateString = date.toFormat('YYYY/MM/DD HH24:MI');

  User.findOne({deviceId: id}, function(err, user) {
    const data = {
      user: {id: user.deviceId, name: user.name},
      date: dateString,
      permission: permission
    };

    sockets.forEach(function(socket) {
      if (!socket) {
        return;
      }

      NotificationDispatcher.dispatch(socket, {type: type, data: data});
    });
  });
};

const _notifyAuthResult = function(socketIO, userSocket, result, targetUsers) {
  const type = result ? 'auth-successed' : 'auth-failed';
  const data = _formatUsers(socketIO, targetUsers);

  NotificationDispatcher.dispatch(userSocket, {
    type: type,
    data: data
  });
};

const _formatUsers = function(socketIO, users) {
  return users.map(function(user) {return _formatUser(socketIO, user);});
};

const _formatUser = function(socketIO, user) {
  return {
    name: user.name,
    id: user.deviceId,
    iconUrl: null,
    connected: socketIO.socket(user.deviceId) !== null
  };
};

const _getNotificationType = function(result) {
  return result ? 'permission-used' : 'permission-violation';
};

const _getTargetSockets = function(socketIO, targetUsers) {
  return targetUsers.map(function(user) {return socketIO.socket(user.deviceId);});
};

const _getTargetUsers = function(result, requiredUsers, nearPermissionHolders) {
  return (result ? nearPermissionHolders : requiredUsers) || [];
};

module.exports = AuthResultNotificator;
