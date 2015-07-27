var db = require('../../lib/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');
var User = require('../../models/user.js');
var PermissionHelper = require('../support/permission-helper.js');

before(function(done) {
  PermissionHelper.init(done);
});

describe('User', function () {
  describe('findByPermissions', function () {
    it('[ACCESS]$B8"8B$r;}$D$N$O(B9$BL>(B', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 9);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND]$B8"8B$r;}$D$N$O(B6$BL>(B', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 6);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]$B8"8B$r;}$D$N$O(B3$BL>(B', function(done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 3);
        done();
      });
    });
  });

  describe('hasEnoughPermissions', function () {
  });

  describe('hasEnoughPermission', function () {
  });
});
