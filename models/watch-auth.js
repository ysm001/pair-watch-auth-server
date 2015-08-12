'use strict';

const SocketIO = require('../lib/socket-io.js');
const User = require('./user.js');
const Permission = require('./permission.js');
const async = require('async');
const PairingChecker = require('../lib/pairing-checker.js');
const DistanceChecker = require('../lib/distance-checker.js');

let _socketIO = null;

/**
 * Apple Watchを使った認証を扱うクラス
 *
 * @class WatchAuth
 * @constructor
 * @param {SocketIO} io SocketIOオブジェクト
 */
const WatchAuth = function(io) {
  _socketIO = new SocketIO(io);
};

/**
 * 認証を行うメソッド
 *
 * @method auth
 * @param {String} id ユーザID
 * @param {String} permission 要求している権限
 * @param {Function} callback コールバック
 * @param {Integer} timeout レスポンス待機時間
 */
WatchAuth.prototype.auth = function(id, permission, timeout) {
  const socket = _socketIO.socket(id);
  if (!socket) {
    return Promise.reject(Error(id + ' is not connected'));
  }

  return _checkPermission(id, permission).then(function(hasPermission) {
    return [hasPermission, User.findByPermission(permission)]
  }).then(function(hasPermission, requiredUsers) {
    return _checkAccessibility(socket, hasPermission, requiredUsers, timeout)
  });
};

const _checkAccessibility = function(socket, hasPermission, requiredUsers, timeout) {
  return PairingChecker.check(socket, timeout).then(function(result) {
    if (hasPermission) {
      return {accessibility: true};
    } else {
      const promise = DistanceChecker.findNearPermissionHolders(socket, requiredUsers, timeout)

      return promise.then(function(nearPermissionHolders) {
        return {
          accessibility: permissionHolders.length != 0,
          requiredUsers: requiredUsers,
          nearPermissionHolders: nearPermissionHolders
        };
      });
    }
  });
};

const _checkPermission = function(id, permissionName) {
  return User.findByDeviceId(id).then(function(user) {
    return [user, Permission.findByName(permissionName)];
  }).spread(function(user, permission) {
    return user.hasEnoughPermission(permission);
  });
};

/**
 * SocketIOオブジェクトを返すメソッド (デバッグ用)
 *
 * @method socketIO
 * @return {SocketIO} SocketIOオブジェクト
 */
WatchAuth.prototype.socketIO = function() {
  return _socketIO;
};

module.exports = WatchAuth;
