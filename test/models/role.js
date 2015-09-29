var db = require('../../lib/supports/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');
var Role = require('../../models/role.js');
var PermissionHelper = require('../support/permission-helper.js');

before(function(done) {
  PermissionHelper.init(done);
});

describe('Role', function () {
  describe('findByPermissions', function () {
    it('[ACCESS]権限を持つRoleはadmin, user, readonly-user', function (done) {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      Role.findByPermissions(perms).then(function(roles) {
        assert.equal(roles.length, 3);
        assert.equal(roles[0].name, 'admin');
        assert.equal(roles[1].name, 'user');
        assert.equal(roles[2].name, 'readonly-user');

        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND]権限を持つRoleはadmin, user', function (done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND']);
      Role.findByPermissions(perms).then(function(roles) {
        assert.equal(roles.length, 2);
        assert.equal(roles[0].name, 'admin');
        assert.equal(roles[1].name, 'user');

        done();
      });
    });

    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]権限を持つRoleはadmin', function (done) {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      Role.findByPermissions(perms).then(function(roles) {
        assert.equal(roles.length, 1);
        assert.equal(roles[0].name, 'admin');

        done();
      });
    });
  });
});
