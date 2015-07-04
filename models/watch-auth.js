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
   * @param {[Object]} params 認証用パラメータ
   * @param {String} params.id ユーザID
   * @param {Integer} timeout レスポンス待機時間
   */
  WatchAuth.prototype.auth = function(params, callback, timeout) {
    var sockets = _socketIO.sockets();
    var socket = _socketIO.socket(params.id);

    var tasks = [
      function(next) {
        _checkPermission.call(this, params, next, timeout);
      },
      function(result, requiredUsers, next) {
        next(!socket ? params.id + " is not connected." : null, result, requiredUsers);
      },
      function(result, requiredUsers,next) {
        _checkAccessibility(socket, result, requiredUsers, next, timeout);
      }
    ];

    async.waterfall(tasks, callback);
  }

  var _checkAccessibility = function(socket, hasPermission, requiredUsers, callback, timeout) {
    var tasks = [
      function(next) {
        PairingChecker.check(socket, next, timeout);
      },
      function(result, next) {
        next(!result ? "pairing check is failed" : null, result);
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

  var _checkPermission = function(params, callback) {
    Permission.findOne({name: params.permission}, function(err, permission) {
      User.findOne({deviceId: params.id}, function(err, user) {
        user.hasEnoughPermission(permission, callback);
      });
    });
  }

  return WatchAuth;
})();
