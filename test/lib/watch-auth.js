var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/socket-io.js');
var WatchAuth = require('../../models/watch-auth.js');
var ClientHelper = require('../support/client-helper.js');
var LoggerHelper = require('../support/logger-helper.js');
var SocketNotConnectedError = require('../../lib/errors/socket-not-connected-error.js');
const PermissionError = require('../../lib/errors/permission-error.js')

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

describe('WatchAuth', function () {
  describe('auth', function () {
    it('存在しないユーザの認証は成功しない', function (done) {
      var id = 'not-existing-user'
      var users = [id];
      var permission = 'ACCESS';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).catch(function(err) {
          assert.equal(err.modelName, 'User');
          assert.equal(JSON.stringify(err.condition), JSON.stringify({'deviceId': id}));
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });

    it('未接続のユーザの認証は成功しない', function (done) {
      var id = 'DUMMYUID-ADMN-USER-0000-00000000000A';
      var permission = 'ACCESS';

      watchAuth.auth(id, permission, 100).then(function() {}).catch(function(err) {
        assert.equal(err.id, id);
        assert.equal(err.message, id + ' is not connected.');
        done();
      }).catch(function(err) {done(err)});
    });

    it('要求された権限を持つユーザの認証は成功する', function (done) {
      var id = 'DUMMYUID-ADMN-USER-0000-00000000000A';
      var users = [id];

      var permission = 'ACCESS';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).then(function(result) {
          assert.equal(result.accessibility, true);
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });

    it('要求された権限を持たないユーザの認証は失敗し、権限を持つユーザ情報が返される', function (done) {
      var id = 'DUMMYUID-0000-USER-0000-00000000000A';
      var users = [id];
      var permission = 'EXEC_ROOT_COMMAND';

      ClientHelper.doTestWithUsers(socketIO, users, function(clients, next) {
        watchAuth.auth(id, permission, 100).then(function() {}).catch(PermissionError, function(err) {
          assert.equal(err.requiredUsers.length, 5);
          next();
        }).catch(function(err) {next(err)});
      }, done);
    });
  });
});
