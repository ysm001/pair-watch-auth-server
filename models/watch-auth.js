var SocketIO = require('../lib/socket-io.js');
var RequestDispatcher = require('../lib/request-dispatcher.js');
var Puid = require('puid');
var User = require('./user.js');
var Permission = require('./permission.js');
var async = require('async')
var PairingChecker = require('../lib/pairing-checker.js')
var DistanceChecker = require('../lib/distance-checker.js')

module.exports = (function() {
  var _socketIO = null;
  var _requestDispatcher = null;

  /**
   * Apple Watchを使った認証を扱うクラス
   *
   * @class WatchAuth
   * @constructor
   */
  var WatchAuth = function(io) {
    _socketIO = new SocketIO(io);
  }

  /**
   * 認証を行うメソッド
   *
   * @method auth
   * @param {String} id ユーザID
   * @param {String} permission 要求している権限
   * @param {Integer} timeout レスポンス待機時間
   */
  WatchAuth.prototype.auth = function(id, permission, callback, timeout) {
    var sockets = _socketIO.sockets();
    var socket = _socketIO.socket(id);

    var tasks = [
      function(next) {
        _checkPermission.call(this, id, permission, next);
      },
      function(result, requiredUsers, next) {
        next(!socket ? id + " is not connected." : null, result, requiredUsers);
      },
      function(result, requiredUsers,next) {
        _checkAccessibility(socket, result, requiredUsers, next, timeout);
      }
    ];

    async.waterfall(tasks, function(err, result, requiredUsers) {
      callback(err, result && !err, requiredUsers);
    });
  }

  var _checkAccessibility = function(socket, hasPermission, requiredUsers, callback, timeout) {
    var tasks = [
      function(next) {
        PairingChecker.check(socket, next, timeout);
      },
      function(result, next) {
        next(!result ? "pairing check is failed." : null, result);
      },
      function(result, next) {
        if (hasPermission) next(null, true);
        else DistanceChecker.checkPermissionHoldersAreNear(socket, requiredUsers, next, timeout);
      }
    ];

    async.waterfall(tasks , function(err, result) {
      callback(err, result, requiredUsers);
    });
  }

  var _checkPermission = function(id, permission, callback) {
    Permission.findOne({name: permission}, function(err, permission) {
      User.findOne({deviceId: id}, function(err, user) {
        if (err || !user) callback(err || id + ' is not valid user.', false);
        else user.hasEnoughPermission(permission, callback);
      });
    });
  }
  /**
   * SocketIOオブジェクトを返すメソッド (デバッグ用)
   *
   * @method socketIO
   * @return {SocketIO} SocketIOオブジェクト
   */
  WatchAuth.prototype.socketIO = function() {
    return _socketIO;
  }

  return WatchAuth;
})();
