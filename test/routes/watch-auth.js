var assert = require('assert');
var ServerHelper = require('../support/server-helper.js');
var SocketIO = require('../../lib/supports/socket-io.js');
var RequestDispatcher = require('../../lib/request-dispatcher.js');
var ClientHelper = require('../support/client-helper.js');
var UserHelper = require('../support/user-helper.js');
var LoggerHelper = require('../support/logger-helper.js');
var request = require('request');
var url = "http://localhost:" + ServerHelper.port() + "/auth";
var Promise = require('bluebird');

var socketIO;
before(function(done) {
  LoggerHelper.setLevel('info');
  ServerHelper.init();
  socketIO = new SocketIO(ServerHelper.io);
  require('../../routes/router')(ServerHelper.app, ServerHelper.io);

  UserHelper.init(done);
});

beforeEach(function(done) {
  ServerHelper.waitForDisconnect(socketIO, done);
});

var toJSON = function(data) {
  return (new Function("return " + data))();
}

var auth = function(id, permission) {
  var options = {
    uri: url,
    form: {id: id, permission: permission},
    json: true
  };

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(Error(error + "[" + response.statusCode + "]"));
      }
    });
  });
}

describe('/auth', function () {
  it('クライアントが接続されていない場合、SocketNotConnectedErrorが返ってくること', function (done) {
    var id = 'E4D5CE7F-0F20-4FA3-B0BB-2A638ECB971F';
    var permission = 'EXEC_ROOT_COMMAND';
    auth(id, permission).then(function(response) {
      assert.equal(response.error.name, 'SocketNotConnectedError');
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('存在しないPermissionを指定すると、RecordNotFoundErrorが返ってくること', function (done) {
    var id = UserHelper.getUser('user-A').deviceId
    var permission = 'NOT_EXISTING_COMMAND';
    var users = [id];

    var testFunction = function(clients, next) {
      auth(id, permission).then(function(response) {
        assert.equal(response.error.name, "RecordNotFoundError");
        next();
      }).catch(function(err) {
        next(err);
      });
    }

    ClientHelper.doTestWithUsers(socketIO, users, testFunction, done);
  });

  it('クライアントが接続されているがログインしていない場合、UnauthorizedErrorが返ってくること', function (done) {
    done()
  });

  it('クライアントが適切なPermissionを持っている場合、認証が成功し、クライアントに認証成功通知が送信されること', function (done) {
    var id = UserHelper.getUser('user-A').deviceId
    var permission = 'EXEC_COMMAND';
    var users = [id];

    var testFunction = function(clients, next) {
      auth(id, permission).then(function(response) {
        assert.equal(response.result, true);
        setTimeout(next, 500);
      }).catch(function(err) {
        next(err);
      });
    }

    var after = function(pipes) {
      var data = pipes[id];
      assert.equal(data.length, 1);

      var json = toJSON(data[0])
      assert.equal(json.notification.type, 'auth-successed');
    }

    ClientHelper.doTestWithUsers(socketIO, users, testFunction, done, after);
  });

  describe('クライアントが適切なPermissionを持っていない場合', function() {
    it('周囲に適切なPermissionを持ったクライアントがいない場合PermissionErrorが返り、Permissionを持ったクライアントに権限違反通知が創始されること', function (done) {
      var id = UserHelper.getUser('user-A').deviceId
      var adminId = UserHelper.getUser('admin-user-A').deviceId;
      var permission = 'EXEC_ROOT_COMMAND';
      var users = [id, adminId];

      var testFunction = function(clients, next) {
        auth(id, permission).then(function(response) {
          assert.equal(response.result, false);
          assert.equal(response.error.name, 'PermissionError');
          setTimeout(next, 500);
        }).catch(function(err) {
          next(err);
        });
      }

      var after = function(pipes) {
        var userData = pipes[id];
        var adminData = pipes[adminId];
        assert.equal(userData.length, 1);
        assert.equal(adminData.length, 1);

        var userJson = toJSON(userData[0])
        var adminJson = toJSON(adminData[0])
        assert.equal(userJson.notification.type, 'auth-failed');
        assert.equal(adminJson.notification.type, 'permission-violation');
      }

      ClientHelper.doTestWithUsers(socketIO, users, testFunction, done, after);
    });

    it('周囲に適切なPermissionを持ったクライアントがいる場合、認証が成功すること', function (done) {
      done()
    });
  });
});
