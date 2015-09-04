'use strict';

const lodash = require('lodash');
const RequestDispatcher = require('../lib/request-dispatcher.js');
const _logger = require('./logger.js');
const User = require('../models/user.js');
const Promise = require('bluebird');
const PermissionHoldersNotFoundError = require('../lib/errors/permission-holders-not-found-error.js');

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
 * @param {Integer} timeout レスポンス待機時間
 * @returns {Promise} this
 */
DistanceChecker.findNearPermissionHolders = function(socket, permissionHolders, timeout) {
  const permissionHolderIds = permissionHolders.map(function(holder) {return holder.deviceId;});

  return _emitDistanceRequest(socket, timeout).then(function(distances) {
    const nearPermissionHolderIds = _findNearPermissionHolderIds(socket, distances, permissionHolderIds);

    _logger.debug(distances);

    if (nearPermissionHolderIds.length === 0) {
      return Promise.reject(new PermissionHoldersNotFoundError(permissionHolders));
    }

    return User.findByDeviceIds(nearPermissionHolderIds);
  });
};

const _findNearPermissionHolderIds = function(socket, distances, permissionHolderIds) {
  const nearUserIds = _getNearUserIdsFromDistances(socket.handshake.user.id, distances);

  _logger.debug(nearUserIds);
  return lodash.intersection(nearUserIds, permissionHolderIds);
};

const _getNearUserIdsFromDistances = function(userId, distances) {
  const nearDistances = distances.filter(function(distance) {return distance.distance === 'immediate';});

  console.log(nearDistances)
  return nearDistances.map(function(distance) {
    if (distance['source-id'] === userId) {
      return distance['target-id'];
    } else if (distance['target-id'] === userId) {
      return distance['source-id'];
    }

    return null;
  });
};

/**
 * 距離計測のリクエストを送るメソッド
 *
 * @method _emitDistanceRequest
 * @private
 * @param {Socket} socket 送信先socket
 * @param {Integer} timeout レスポンス待機時間
 * @returns {Promise} this
 */
const _emitDistanceRequest = function(socket, timeout) {
  return RequestDispatcher.dispatch(socket, 'distance', timeout);
};

module.exports = DistanceChecker;
