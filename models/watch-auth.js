var SocketIO = require('../lib/socket-io.js');
var RequestDispatcher = require('../lib/request-dispatcher.js');
var Puid = require('puid');
var User = require('./user.js');
var Permission = require('./permission.js');

module.exports = (function() {
  var _socketIO = null;
  var _requestDispatcher = null;

  var WatchAuth = function(io) {
    _socketIO = new SocketIO(io);
  }

  WatchAuth.prototype.auth = function(params, callback, timeout) {
    var sockets = _socketIO.sockets();

    _checkPermission.call(this, params, function(err, result, requiredUsers) {
      var socket = _socketIO.socket(params.id);

      if (!socket) {
        console.log(params.id + "is not connected.");
        callback(null, {});
        return;
      }

      if (result) {
        console.log(params.id + " has enough permission to access " + params.permission);
        _emitCheckPairingRequest(socket, function(response) {
          callback(null, response);
        }, timeout);
      } else {
        console.log(params.id + " has not enough permission to access " + params.permission);
        _emitDistanceRequest(socket, function(response) {
          callback(null, response, requiredUsers);
        }, timeout);
      }
    });
  }

  var _emitDistanceRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'distance', function(response) {
      callback(response);
    }, timeout);
  }

  var _emitCheckPairingRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'check-pairing', function(response) {
      callback(response);
    }, timeout);
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
