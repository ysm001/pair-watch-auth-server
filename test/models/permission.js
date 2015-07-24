var db = require('../../lib/db.js');
var assert = require('assert');
var Permission = require('../../models/permission.js');

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

describe('Permission', function () {
  describe('hasEnoughPermissions', function () {
    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]は[ACCESS, EXEC_COMMAND]の権限を持つ', function () {
      var perms = getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      var required = getPermissions(['ACCESS', 'EXEC_COMMAND']);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });

    it('[ACCESS]は[ACCESS, EXEC_COMMAND]の権限を持たない', function () {
      var perms = getPermissions(['ACCESS']);
      var required = getPermissions(['ACCESS', 'EXEC_COMMAND']);
      assert.equal(Permission.hasEnoughPermissions(perms, required), false);
    });

    it('[ACCESS]は[]の権限を持つ', function () {
      var perms = getPermissions(['ACCESS']);
      var required = getPermissions([]);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });

    it('[]は[]の権限を持つ', function () {
      var perms = getPermissions(['ACCESS']);
      var required = getPermissions([]);
      assert.equal(Permission.hasEnoughPermissions(perms, required), true);
    });
  });
});
