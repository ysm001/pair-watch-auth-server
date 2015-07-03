var RequestDispatcher = require('../lib/request-dispatcher.js');
var async = require('async')

module.exports = (function() {
  PairingChecker = function() {}

  PairingChecker.check = function(socket, callback, timeout) {

    var tasks = [
      function(next) {
        _emitCheckPairingRequest(socket, next, timeout);
      },
      function(response, next) {
        var err = null;

        if (!response) err = "invalid token";
        else if (response.length == 0) err = "no response";
        else if (response.length > 0 ) err = "too many response";

        next(err, response);
      },
    ];

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
