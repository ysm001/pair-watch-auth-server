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
      var id = 'not-existing-user'
      var users = [id];
      var permission = 'ACCESS';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).catch(function(err) {
          assert.equal(err.message, 'not-existing-user is not valid user.');
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });

    it('未接続のユーザの認証は成功しない', function (done) {
      var id = 'UID-ADMIN-USER-A';
      var permission = 'ACCESS';

      watchAuth.auth(id, permission, 100).then(function() {}).catch(function(err) {
        assert.equal(err.message, 'UID-ADMIN-USER-A is not connected.');
        done();
      }).catch(function(err) {done(err)});
    });

    it('要求された権限を持つユーザの認証は成功する', function (done) {
      var users = ['UID-ADMIN-USER-A'];

      var id = 'UID-ADMIN-USER-A';
      var permission = 'ACCESS';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).then(function(result) {
          assert.equal(result.accessibility, true);
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });

    it('要求された権限を持たないユーザの認証は失敗し、権限を持つユーザ情報が返される', function (done) {
      var users = ['UID-USER-A'];

      var id = 'UID-USER-A';
      var permission = 'EXEC_ROOT_COMMAND';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).then(function() {}).catch(function(err) {
          assert.equal(err.requiredUsers.length, 5);
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });
  });
});
