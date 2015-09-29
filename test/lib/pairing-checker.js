var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/supports/socket-io.js');
var PairingChecker = require('../../lib/pairing-checker.js');
var ClientHelper = require('../support/client-helper.js');
var LoggerHelper = require('../support/logger-helper.js');

var socketIO;
before(function() {
  LoggerHelper.setLevel('info');
  ServerHelper.init();
  socketIO = new SocketIO(ServerHelper.io);
});

beforeEach(function(done) {
  ServerHelper.waitForDisconnect(socketIO, done);
});

describe('PairingChecker', function () {
  describe('check', function () {
    it('ペアリング済のクライアントが起動している状態でペアリング状態のチェックが成功する', function (done) {
      var users = ['UID-READONLY-USER-A'];
      var testFunction = function(clients, next) {
        var socket = socketIO.socket(users[0]);
        PairingChecker.check(socket, 100).then(function(result) {
          assert.equal(result, true);
          next();
        })
      }

      ClientHelper.doTestWithUsers(socketIO, users, testFunction, done);
    });
  });
});
