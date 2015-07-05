var async = require('async')
var lodash = require('lodash');
var RequestDispatcher = require('../lib/request-dispatcher.js');

module.exports = (function() {
  /**
   * iOSアプリ間の距離を扱うクラス
   *
   * (サーバ側からは距離計測のリクエストを送るだけで、実際に距離計測を行うのはiOSアプリ側)
   *
   * @class DistanceChecker
   * @constructor
   */
  var DistanceChecker = function() {}

  /**
   * 指定した権限を持つユーザが近くにいるかを確認するメソッド
   *
   * @method checkPermissionHoldersAreNear
   * @static
   * @param {Socket} socket 確認先socket
   * @param {[User]} permissionHolders 権限を持つユーザ
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間 
   */
  DistanceChecker.checkPermissionHoldersAreNear = function(socket, permissionHolders, callback, timeout) {
    _findNearPermissionHolders(socket, permissionHolders, function(err, result) {
      callback(err, result.length != 0);
    }, timeout);
  }

  /**
   * 近くにいる権限を持つユーザを探すメソッド
   *
   * @method _findNearPermissionHolders
   * @private
   * @param {Socket} socket 確認先socket
   * @param {[User]} permissionHolders 権限を持つユーザ
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間 
   */
  _findNearPermissionHolders = function(socket, permissionHolders, callback, timeout) {
    permissionHolderIds = permissionHolders.map(function(holder) {return holder.deviceId});

    var tasks = [
      function(next) {
        _emitDistanceRequest(socket, next, timeout);
      },
      function(distances, next) {
        var nearUserIds = distances.
          filter(function(distance) {return distance.value == 'immediate' }).
          map(function(distance) {return distance['target-id']});

        var nearPermissionHolderIds = lodash.intersection(nearUserIds, permissionHolderIds);

        next(null, nearPermissionHolderIds);
      }
    ];

    async.waterfall(tasks, callback);
  }

  /**
   * 距離計測のリクエストを送るメソッド
   *
   * @method _emitDistanceRequest
   * @private
   * @param {Socket} socket 送信先socket
   * @param {Function} callback 結果を受け取るcallback
   * @param {Integer} timeout レスポンス待機時間 
   */
  var _emitDistanceRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'distance', function(response) {
      callback(null, response);
    }, timeout, 11111/* debug */);
  }
  
  return DistanceChecker;
})();
