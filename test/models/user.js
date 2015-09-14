var db = require('../../lib/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');
var User = require('../../models/user.js');
var PermissionHelper = require('../support/permission-helper.js');
var RecordNotFoundError = require('../../lib/errors/record-not-found-error.js')

before(function(done) {
  PermissionHelper.init(done);
});

describe('User', function () {
  describe('findByPermissions', function () {
    it('[ACCESS]権限を持つのは9名', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      User.findByPermissions(perms).then(function(users) {
        assert.equal(users.length, 12);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND]権限を持つのは5名', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND']);
      User.findByPermissions(perms).then(function(users) {
        assert.equal(users.length, 8);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]権限を持つのは3名', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      User.findByPermissions(perms).then(function(users) {
        assert.equal(users.length, 5);
        done();
      });
    });
  });

  describe('findByDeviceId', function() {
    it('存在するDeviceIDを指定した場合、指定したDeviceIdを持つUserが取得できる', function(done) {
      var deviceId = '12345678-1234-1234-1234-123456789012';
      User.findByDeviceId(deviceId).then(function(user) {
        assert.equal(user.deviceId, deviceId);
        done();
      }).catch(function(err) {done(err);});
    });

    it('存在しないDeviceIDを指定した場合、RecordNotFoundErrorが投げられる', function(done) {
      var deviceId = 'not-existing-id';
      User.findByDeviceId(deviceId).then(function() {}).catch(RecordNotFoundError, function(err) {
        assert.equal(err.data.modelName, 'User');
        assert.equal(JSON.stringify(err.data.condition), JSON.stringify({'deviceId': deviceId}));
        done();
      }).catch(function(err) {done(err);});
    });
  });

  describe('findByPermission', function() {
    it('指定したPermissionを持つUserが存在する場合、指定したPermissionを持つUserが取得できる', function(done) {
      var permission = PermissionHelper.getPermission('EXEC_ROOT_COMMAND');
      User.findByPermission(permission).then(function(users) {
        assert.equal(users.length, 5);
        done();
      }).catch(function(err) {done(err);});
    });
  });

  describe('hasEnoughPermissions', function () {
  });

  describe('hasEnoughPermission', function () {
  });
});
