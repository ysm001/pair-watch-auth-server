'use strict';

require('date-utils');
const NotificationDispatcher = require('./notification-dispatcher.js');
const User = require('../models/user.js');

/**
 * �F�،��ʂ�ʒm����N���X 
 *
 * @class AuthResultNotificator
 * @constructor
 */
const AuthResultNotificator = function() {};

/**
 * ���[�U�ɔF�،��ʂ�ʒm���郁�\�b�h
 *
 * @method notify
 * @param {SocketIO} socketIO �ڑ��ς�SocketIO�I�u�W�F�N�g
 * @param {String} id ���t��̃��[�UID
 * @param {String} permission �v�����ꂽ����
 * @param {[User]} requiredUsers �F�؂ɕK�v�Ƃ���錠���ێ��� (�F�،��ʂ�false�̏ꍇ�A����id�Ŏw�肳�ꂽ���[�U�ɏ�񂪒ʒm����܂�)
 * @param {[User]} nearPermissionHolders �����̎���ɋ��錠���ێ��� (�F�،��ʂ�true�̏ꍇ�A����id�Ŏw�肳�ꂽ���[�U�ɏ�񂪒ʒm����܂�)
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
