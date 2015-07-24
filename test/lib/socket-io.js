var assert = require('assert');
var app = require('../../app');
var config = require('../../config/server.json').development;
var http = require('http');
var port = config.port;
var SocketIO = require('../../lib/socket-io.js');
var ClientHelper = require('../support/client-helper.js');
app.set('port', port);

var server = http.createServer(app);
var io = require('socket.io')(server)

var socketIO;
before(function() {
  server.listen(port);
  socketIO = new SocketIO(io);
});

var spawnClients = function(users) {
  return users.map(function(user) {ClientHelper.spawn(user)});
};

var doTestWithUser = function(users, testFunction) {
  var clients = spawnClients(users);

  setTimeout(function() {
    testFunction(clients);
  }, 1000);
};

describe('SocketIO', function () {
  describe('sockets', function () {
    it('クライアント未接続時のsocketsのサイズは0', function () {
      assert.equal(socketIO.sockets().length, 0);
    });

    it('2クライアント接続時のsocketsのサイズは2', function (done) {
      var users = ['READONLY-USER-A', 'READONLY-USER-B'];

      doTestWithUser(users, function(clients) {
        assert.equal(socketIO.sockets().length, 2);
        done();
      });
    });
  });

  describe('socket', function () {
    it('接続済のsocketが全て取得可能かつ接続していないsocketの情報は取得不可能', function (done) {
      var users = 
        ['READONLY-USER-A', 'READONLY-USER-B',
          'USER-A', 'USER-B', 'ADMIN-USER-A'];

      doTestWithUser(users, function(clients) {
        users.forEach(function(user) {
          assert.notEqual(socketIO.socket(user), null);
        });

        assert.equal(socketIO.socket('ADMIN-USER-B'), null);
        done();
      });
    });

    it('接続済クライアントのsocketにはIDが紐付けられている', function (done) {
      var users = ['READONLY-USER-A', 'READONLY-USER-B'];

      doTestWithUser(users, function(clients) {
        users.forEach(function(user) {
          assert.equal(socketIO.socket(user).handshake.user.id, user);
        });

        done();
      });
    });
  });
});

