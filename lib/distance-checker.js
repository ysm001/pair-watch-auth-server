'use strict';

const async = require('async');
const lodash = require('lodash');
const RequestDispatcher = require('../lib/request-dispatcher.js');
const _logger = require('./logger.js');
const User = require('../models/user.js');

/**
 * iOSアプリ間の距離を扱うクラス
 *
 * (サーバ側からは距離計測のリクエストを送るだけで、実際に距離計測を行うのはiOSアプリ側)
 *
 * @class DistanceChecker
 * @constructor
 */
const DistanceChecker = function() {};

/**
 * 指定した権限を持つユーザが近くにいるかを確認するメソッド
 *
 * @method checkPermissionHoldersAreNear
 * @static
 * @param {Socket} socket 確認先socket
 * @param {[User]} permissionHolders 権限を持つユーザ
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
DistanceChecker.checkPermissionHoldersAreNear = function(socket, permissionHolders, callback, timeout) {
  _findNearPermissionHolders(socket, permissionHolders, function(err, result) {
    callback(err, result.length !== 0, result);
  }, timeout);
};

/**
 * 近くにいる権限を持つユーザを探すメソッド
 *
 * @method _findNearPermissionHolders
 * @private
 * @param {Socket} socket 確認先socket
 * @param {[User]} permissionHolders 権限を持つユーザ
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
const _findNearPermissionHolders = function(socket, permissionHolders, callback, timeout) {
  const permissionHolderIds = permissionHolders.map(function(holder) {return holder.deviceId;});

  const tasks = [
    function(next) {
      _emitDistanceRequest(socket, next, timeout);
    },
    function(distances, next) {
      _logger.debug(distances);
      const userId = socket.handshake.user.id;
      const nearDistances = distances.filter(function(distance) {return distance.distance === 'immediate';});
      const nearUserIds = nearDistances.map(function(distance) {
        if (distance['source-id'] === userId) {
          return distance['target-id'];
        } else if (distance['target-id'] === userId) {
          return distance['source-id'];
        }

        return null;
      });

      _logger.debug(nearUserIds);
      const nearPermissionHolderIds = lodash.intersection(nearUserIds, permissionHolderIds);

      User.findByDeviceIds(nearPermissionHolderIds, next);
    }
  ];

  async.waterfall(tasks, callback);
};

/**
 * 距離計測のリクエストを送るメソッド
 *
 * @method _emitDistanceRequest
 * @private
 * @param {Socket} socket 送信先socket
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
const _emitDistanceRequest = function(socket, callback, timeout) {
  RequestDispatcher.dispatch(socket, 'distance', function(response) {
    callback(null, response);
  }, timeout);
};

module.exports = DistanceChecker;
