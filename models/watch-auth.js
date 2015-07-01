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
      console.log(result);
      console.log(requiredUsers);
    });

    RequestDispatcher.dispatch(sockets, 'distance', function(response) {
      callback(response);
    }, 1000);
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
