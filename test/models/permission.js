var db = require('../support/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');
var PermissionHelper = require('../support/permission-helper.js');

before(function(done) {
  PermissionHelper.init(done);
});

describe('Permission', function () {
  describe('hasEnoughPermissions', function () {
    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]は[ACCESS, EXEC_COMMAND]の権限を持つ', function () {
      var perms = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      var required = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND']);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });

    it('[ACCESS]は[ACCESS, EXEC_COMMAND]の権限を持たない', function () {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      var required = PermissionHelper.getPermissions(['ACCESS', 'EXEC_COMMAND']);
      assert.equal(Permission.hasEnoughPermissions(perms, required), false);
    });

    it('[ACCESS]は[]の権限を持つ', function () {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      var required = PermissionHelper.getPermissions([]);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });

    it('[]は[]の権限を持つ', function () {
      var perms = PermissionHelper.getPermissions(['ACCESS']);
      var required = PermissionHelper.getPermissions([]);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });
  });
});
