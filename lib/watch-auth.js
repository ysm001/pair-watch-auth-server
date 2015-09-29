'use strict';

const SocketIO = require('./supports/socket-io.js');
const User = require('../models/user.js');
const Permission = require('../models/permission.js');
const PairingChecker = require('./pairing-checker.js');
const DistanceChecker = require('./distance-checker.js');
const SocketNotConnectedError = require('./errors/socket-not-connected-error.js')
const PermissionError = require('./errors/permission-error.js')
const PermissionHoldersNotFoundError = require('./errors/permission-holders-not-found-error.js')
const async = require('async');

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
WatchAuth.prototype.auth = function(id, permissionName, timeout) {
  const socket = _socketIO.socket(id);
  if (!socket) {
    return Promise.reject(new SocketNotConnectedError(id));
  }

  return Permission.findByName(permissionName).then(function(permission) {
    return [_checkPermission(id, permissionName), User.findByPermission(permission)];
  }).spread(function(hasPermission, requiredUsers) {
    return _checkAccessibility(socket, hasPermission, requiredUsers, timeout)
  }).then(function(result) {
    return Promise.resolve(result);
  }).catch(PermissionHoldersNotFoundError, function(err) {
    return _throwPermissionError(id, permissionName, err.data.permissionHolders);
  });
};

const _throwPermissionError = function(id, permissionName, permissionHolders) {
  const requiredUsers = permissionHolders.map(function(user) {return user.toSimpleFormat();});

  return User.findByDeviceId(id).then(function(user) {
    return Promise.reject(new PermissionError(user.toSimpleFormat(), permissionName, requiredUsers));
  });
}

const _checkAccessibility = function(socket, hasPermission, requiredUsers, timeout) {
  return PairingChecker.check(socket, timeout).then(function(result) {
    if (hasPermission) {
      return {accessibility: true};
    } else {
      const promise = DistanceChecker.findNearPermissionHolders(socket, requiredUsers, timeout)

      return promise.then(function(nearPermissionHolders) {
        return {
          accessibility: nearPermissionHolders.length != 0,
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
