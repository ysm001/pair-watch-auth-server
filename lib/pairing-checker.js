var RequestDispatcher = require('../lib/request-dispatcher.js');
var async = require('async')

module.exports = (function() {
  PairingChecker = function() {}

  PairingChecker.check = function(socket, callback, timeout) {
    var tasks = [];

    tasks.push(function(next) {
      _emitCheckPairingRequest(socket, next, timeout);
    });

    tasks.push(function(response, next) {
      next(!response ? "invalid token" : null, response);
    });

    tasks.push(function(response, next) {
      next(response.length == 0 ? "no response" : null, response);
    });

    tasks.push(function(response, next) {
      next(response.length > 0 ? "too many response" : null, response);
    });

    async.waterfall(tasks, function(err, response) {
      callback(null, response[0].result);
    });
  }

   var _emitCheckPairingRequest = function(socket, callback, timeout) {
    RequestDispatcher.dispatch(socket, 'check-pairing', function(response) {
      callback(null, response);
    }, timeout);
  }

  return PairingChecker;
})();
