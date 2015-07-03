var async = require('async')
var lodash = require('lodash');
var RequestDispatcher = require('../lib/request-dispatcher.js');

module.exports = (function() {
  var DistanceChecker = function() {}

  DistanceChecker.checkPermissionHoldersAreNear = function(socket, permissionHolders, callback, timeout) {
    _findNearPermissionHolders(socket, permissionHolders, function(err, result) {
      callback(err, result.length != 0);
    }, timeout);
  }

  _findNearPermissionHolders = function(socket, permissionHolders, callback, timeout) {
    var threshold = 150;
    permissionHolderIds = permissionHolders.map(function(holder) {return holder.deviceId});

    var tasks = [
      function(next) {
        _emitDistanceRequest(socket, next, timeout);
      },
      function(distances, next) {
        var nearUserIds = distances.
          filter(function(distance) {return distance.value < threshold}).
          map(function(distance) {return distance['target-id']});

        var nearPermissionHolderIds = lodash.intersection(nearUserIds, permissionHolderIds);

        next(null, nearPermissionHolderIds);
      }
    ];

    async.waterfall(tasks, callback);
  }

  var _emitDistanceRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'distance', function(response) {
      callback(null, response);
    }, timeout);
  }
  
  return DistanceChecker;
})();
