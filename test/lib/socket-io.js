var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/socket-io.js');
var ClientHelper = require('../support/client-helper.js');

var socketIO;
before(function() {
  ServerHelper.init();
  socketIO = new SocketIO(ServerHelper.io);
});

beforeEach(function(done) {
  ServerHelper.waitForDisconnect(socketIO, done);
});

describe('SocketIO', function () {
  describe('sockets', function () {
    it('クライアント未接続時のsocketsのサイズは0', function () {
      assert.equal(socketIO.sockets().length, 0);
    });

    it('2クライアント接続時のsocketsのサイズは2', function (done) {
      var users = ['READONLY-USER-A', 'READONLY-USER-B'];

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        assert.equal(socketIO.sockets().length, 2);
        next();
      }, done);
    });
  });

  describe('socket', function () {
    it('接続済のsocketが全て取得可能かつ接続していないsocketの情報は取得不可能', function (done) {
      var users = 
        ['UID-READONLY-USER-A', 'UID-READONLY-USER-B',
          'UID-USER-A', 'UID-USER-B', 'UID-ADMIN-USER-A'];

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        users.forEach(function(user) {
          assert.notEqual(socketIO.socket(user), null);
        });

        assert.equal(socketIO.socket('ADMIN-USER-B'), null);
        next();
      }, done);
    });

    it('接続済クライアントのsocketにはIDが紐付けられている', function (done) {
      var users = ['UID-READONLY-USER-A', 'UID-READONLY-USER-B'];

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        users.forEach(function(user) {
          assert.equal(socketIO.socket(user).handshake.user.id, user);
        });
        next();
      }, done);
    });
  });
});

