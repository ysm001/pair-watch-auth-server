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
WatchAuth.prototype.auth = function(id, permission, callback, timeout) {
  const socket = _socketIO.socket(id);

  const tasks = [
    function(next) {
      _checkPermission.call(this, id, permission, next);
    },
    function(result, requiredUsers, next) {
      next(!socket ? id + ' is not connected.' : null, result, requiredUsers);
    },
    function(result, requiredUsers, next) {
      _checkAccessibility(socket, result, requiredUsers, next, timeout);
    }
  ];

  async.waterfall(tasks, function(err, result, requiredUsers, nearPermissionHolders) {
    callback(err, result && !err, requiredUsers, nearPermissionHolders);
  });
};

const _checkAccessibility = function(socket, hasPermission, requiredUsers, callback, timeout) {
  const tasks = [
    function(next) {
      PairingChecker.check(socket, next, timeout);
    },
    function(result, next) {
      next(!result ? 'pairing check is failed.' : null, result);
    },
    function(result, next) {
      if (hasPermission) {
        next(null, true);
      } else {
        DistanceChecker.checkPermissionHoldersAreNear(socket, requiredUsers, next, timeout);
      }
    }
  ];

  async.waterfall(tasks, function(err, result, nearPermissionHolders) {
    callback(err, result, requiredUsers, nearPermissionHolders);
  });
};

const _checkPermission = function(id, permissionName, callback) {
  Permission.findOne({name: permissionName}, function(permissionFindErr, permission) {
    User.findOne({deviceId: id}, function(userFindErr, user) {
      if (userFindErr || !user) {
        callback(userFindErr || id + ' is not valid user.', false);
      }else {
        user.hasEnoughPermission(permission, callback);
      }
    });
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
