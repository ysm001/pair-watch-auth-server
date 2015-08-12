var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/socket-io.js');
var WatchAuth = require('../../models/watch-auth.js');
var ClientHelper = require('../support/client-helper.js');
var LoggerHelper = require('../support/logger-helper.js');

var socketIO;
var watchAuth;
before(function() {
  LoggerHelper.setLevel('info');
  ServerHelper.init();
  watchAuth = new WatchAuth(ServerHelper.io);
  socketIO = watchAuth.socketIO();
});

beforeEach(function(done) {
  ServerHelper.waitForDisconnect(socketIO, done);
});

describe('WatchAUth', function () {
  describe('auth', function () {
    it('存在しないユーザの認証は成功しない', function (done) {
      var id = 'not-existing-user';
      var permission = 'ACCESS';

      watchAuth.auth(id, permission, function(err, response) {
        assert.equal(response, false);
        assert.equal(err, 'not-existing-user is not valid user.');
        done();
      }, 100 );
    });

    it('未接続のユーザの認証は成功しない', function (done) {
      var id = 'UID-ADMIN-USER-A';
      var permission = 'ACCESS';

      watchAuth.auth(id, permission, function(err, response) {
        assert.equal(response, false);
        assert.equal(err, 'UID-ADMIN-USER-A is not connected.');
        done();
      }, 100 );
    });

    it('要求された権限を持つユーザの認証は成功する', function (done) {
      var users = ['UID-ADMIN-USER-A'];

      var id = 'UID-ADMIN-USER-A';
      var permission = 'ACCESS';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, function(err, response) {
          assert.equal(response, true);
          next();
        }, 100 );
      }, done);
    });

    it('要求された権限を持たないユーザの認証は失敗し、権限を持つユーザ情報が返される', function (done) {
      var users = ['UID-USER-A'];

      var id = 'UID-USER-A';
      var permission = 'EXEC_ROOT_COMMAND';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, function(err, response, requiredUsers) {
          assert.equal(err, null);
          assert.equal(response, false);
          assert.equal(requiredUsers.length, 5);
          next();
        }, 100 );
      }, done);
    });
  });
});
