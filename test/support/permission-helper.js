module.exports = (function() {
  var Permission = require('../../models/permission.js');
  var promiseQuery = require('../../lib/supports/promise-query.js');

  var PermissionHelper = function() {};
  PermissionHelper.permissions = {};

  PermissionHelper.init = function (done) {
    PermissionHelper.findAll().then(function(results) {
      PermissionHelper.permissions = results;
      done();
    });
  }

  PermissionHelper.getPermissions = function(names) {
    return names.map(function(name) {return PermissionHelper.getPermission(name)});
  }

  PermissionHelper.getPermission = function(name) {
    return PermissionHelper.permissions[name];
  }

  PermissionHelper.findAll = function() {
    return promiseQuery(Permission.find({})).then(function(permissions) {
      const results = {};

      permissions.forEach(function(permission) {
        results[permission.name] = permission;
      });

      return results;
    });
  }

  return PermissionHelper
})();
