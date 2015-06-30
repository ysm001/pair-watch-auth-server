module.exports = (function() {
  var mongoose = require('mongoose');

  var PermissionSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    flag: {type: Number, unique: true}
  });

  PermissionSchema.static('toBitFlag', function(permissions) {
    return permissions
    .map(function(permission) {return permission.flag})
    .reduce(function(prev, cur) {return cur | prev}, 0);
  });

  PermissionSchema.static('hasEnoughPermissions', function(permissions, requiredPermissions) {
    var flag = this.toBitFlag(permissions);

    return requiredPermissions.every(function(requiredPermission) {
      return (requiredPermission.flag & flag) != 0
    })
  })

  return mongoose.model('Permission', PermissionSchema);
}) ();
