'use strict';

const async = require('async');
const lodash = require('lodash');
const RequestDispatcher = require('../lib/request-dispatcher.js');
const _logger = require('./logger.js');
const User = require('../models/user.js');
const Promise = require('bluebird')

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
 * 近くにいる権限を持つユーザを探すメソッド
 *
 * @method findNearPermissionHolders
 * @private
 * @param {Socket} socket 確認先socket
 * @param {[User]} permissionHolders 権限を持つユーザ
 * @param {Function} callback 結果を受け取るcallback
 * @param {Integer} timeout レスポンス待機時間
 * @returns {void}
 */
DistanceChecker.findNearPermissionHolders = function(socket, permissionHolders, timeout) {
  const permissionHolderIds = permissionHolders.map(function(holder) {return holder.deviceId;});

  return _emitDistanceRequest(socket, timeout).then(function(distances) {
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

    return User.findByDeviceIds(nearPermissionHolderIds);
  });
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
const _emitDistanceRequest = function(socket, timeout) {
  return RequestDispatcher.dispatch(socket, 'distance', timeout);
};

module.exports = DistanceChecker;
