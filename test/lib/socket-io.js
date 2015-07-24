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

describe('SocketIO', function () {
  describe('sockets', function () {
    it('繧ｯ繝ｩ繧､繧｢繝ｳ繝域悴謗･邯壽凾縺ｮsockets縺ｮ繧ｵ繧､繧ｺ縺ｯ0', function () {
      assert.equal(socketIO.sockets().length, 0);
    });

    it('2繧ｯ繝ｩ繧､繧｢繝ｳ繝域磁邯壽凾縺ｮsockets縺ｮ繧ｵ繧､繧ｺ縺ｯ2', function (done) {
      var users = ['READONLY-USER-A', 'READONLY-USER-B'];
      var clients = spawnClients(users);

      setTimeout(function() {
        assert.equal(socketIO.sockets().length, 2);
        done();
      }, 1000);
    });
  });

  describe('socket', function () {
    it('接続済のsocketが全て取得可能かつ接続していないsocketの情報は取得不可能', function (done) {
      var users = [
        'READONLY-USER-A',
        'READONLY-USER-B',
        'USER-A',
        'USER-B',
        'ADMIN-USER-A'
      ];

      var clients = spawnClients(users);

      setTimeout(function() {
        users.forEach(function(user) {
          assert.notEqual(socketIO.socket(user), null);
        });

        assert.equal(socketIO.socket('ADMIN-USER-B'), null);

        done();
      }, 1000);
    });
  });
});

