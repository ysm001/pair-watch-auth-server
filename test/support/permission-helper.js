module.exports = (function() {
  var Permission = require('../../models/permission.js');

  var PermissionHelper = function() {};
  PermissionHelper.permissions = {};

  PermissionHelper.init = function (done) {
    Permission.findAll().then(function(results) {
      PermissionHelper.permissions = results;
      done();
    });
  }

  PermissionHelper.getPermissions = function(names) {
    return names.map(function(name) {return PermissionHelper.permissions[name]});
  }

  return PermissionHelper
})();
