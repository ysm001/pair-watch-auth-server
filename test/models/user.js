var db = require('../../lib/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');
var Role = require('../../models/role.js');
var User = require('../../models/user.js');

var permissions = {};
before(function (done) {
  Permission.findAll(function(results) {
    permissions = results;
    done();
  });
});

var getPermissions = function(names) {
  return names.map(function(name) {return permissions[name]});
}

describe('User', function () {
  describe('findByPermissions', function () {
    it('[ACCESS]$B8"8B$r;}$D$N$O(B7$BL>(B', function(done) {
      var perms = getPermissions(['ACCESS']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 7);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND]$B8"8B$r;}$D$N$O(B5$BL>(B', function(done) {
      var perms = getPermissions(['ACCESS', 'EXEC_COMMAND']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 5);
        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]$B8"8B$r;}$D$N$O(B2$BL>(B', function(done) {
      var perms = getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      User.findByPermissions(perms, function(err, users) {
        assert.equal(users.length, 2);
        done();
      });
    });
  });

  describe('hasEnoughPermissions', function () {
  });

  describe('hasEnoughPermission', function () {
  });
});
