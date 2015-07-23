var db = require('../../lib/db.js');
var assert = require('assert');
var async = require('async')
var Permission = require('../../models/permission.js');

var permissions = {};
before(function (done) {
  var permissionNames = ['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND'];

  var tasks = permissionNames.map(function(name) {
    return (function(next) {
      Permission.findOne({name: name}, function(err, permission) {
        permissions[name] = permission;
        next();
      });
    });
  });

  async.waterfall(tasks, done);
});

var getPermissions = function(names) {
  return names.map(function(name) {return permissions[name]});
}

describe('Permission', function () {
  describe('toBitFlag', function () {
    it('[ACCESS, EXEC_COMMAND, EXEC_ROOT_COMMAND]は7(00000111)になる', function () {
      var perms = getPermissions(['ACCESS', 'EXEC_COMMAND', 'EXEC_ROOT_COMMAND']);
      assert.equal(Permission.toBitFlag(perms), 7);
    });

    it('[ACCESS, EXEC_ROOT_COMMAND]は5(00000101)になる', function () {
      var perms = getPermissions(['ACCESS', 'EXEC_ROOT_COMMAND']);
      assert.equal(Permission.toBitFlag(perms), 5);
    });
  });
});

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
