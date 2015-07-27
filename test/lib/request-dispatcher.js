var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/socket-io.js');
var RequestDispatcher = require('../../lib/request-dispatcher.js');
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

describe('RequestDispatcher', function () {
  describe('dispatch', function () {
    it('クライアントに対するpingが返ってくる', function (done) {
      var users = ['UID-READONLY-USER-A'];
      var testFunction = function(clients, next) {
        var socket = socketIO.socket(users[0]);
        RequestDispatcher.dispatch(socket, 'ping', function(response) {
          assert.equal(response.length, 8);
          next();
        }, 1000);
      }

      ClientHelper.doTestWithUsers(socketIO, users, testFunction, done);
    });
  });
});
