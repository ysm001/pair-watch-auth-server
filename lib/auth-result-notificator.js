'use strict';

require('date-utils');
const NotificationDispatcher = require('./notification-dispatcher.js');
const AuthResultNotificator = function() {};
const User = require('../models/user.js');

AuthResultNotificator.notify = function(socketIO, id, permission, result, requiredUsers, nearPermissionHolders) {
  const userSocket = socketIO.socket(id);
  const targetUsers = result ? nearPermissionHolders : requiredUsers;
  const targetSockets = targetUsers.map(function(user) {return socketIO.socket(user.deviceId);});
  const type = result ? 'permission-used' : 'permission-violation';

  notifyToAuthorizers(type, targetSockets, id, permission);
  notifyAuthResult(socketIO, userSocket, result, targetUsers);
};

const notifyToAuthorizers = function(type, sockets, id, permission) {
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

const notifyAuthResult = function(socketIO, userSocket, result, targetUsers) {
  const type = result ? 'auth-successed' : 'auth-failed';
  const data = formatUsers(socketIO, targetUsers);

  NotificationDispatcher.dispatch(userSocket, {
    type: type,
    data: data
  });
};

const formatUsers = function(socketIO, users) {
  return users.map(function(user) {return formatUser(socketIO, user);});
};

const formatUser = function(socketIO, user) {
  return {
    name: user.name,
    id: user.deviceId,
    iconUrl: null,
    connected: socketIO.socket(user.deviceId) !== null
  };
};

module.exports = AuthResultNotificator;
