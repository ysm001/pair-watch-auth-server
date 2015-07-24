module.exports = (function() {
  var mongoose = require('mongoose');
  var lodash = require('lodash');

  /**
   * Permission Model
   *
   * @class PermissionSchema
   * @constructor
   */
  var PermissionSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    flag: {type: Number, unique: true}
  });

  /**
   * 指定したpermissionが、要求されるpermissionを持っているかを検査するメソッド
   *
   * @method hasEnoughPermissions
   * @param {[Permission]} permissions permissionの配列
   * @param {[Permission]} requiredPermissions 要求されるpermissionの配列
   * @return {[Boolean]} permissionsがrequiredPermissionsを満たす場合はtrue、そうでなければfalse
   */
  PermissionSchema.static('hasEnoughPermissions', function(permissions, requiredPermissions) {
    permissionNames = permissions.map(function(permission) {return permission.name;});
    requiredPermissionNames = requiredPermissions.map(function(permission) {return permission.name;});

    return lodash.difference(requiredPermissionNames, permissionNames).length == 0;
  })

  /**
   * DB内の全てのPermissionを取得するメソッド (デバッグ用)
   *
   * @method findAll
   * @param {[Function]} callback 返ってきたPermissionを受け取るコールバック
   */
  PermissionSchema.static('findAll', function(callback) {
    this.find({}, function(err, permissions) {
      var results = {};
      permissions.forEach(function(permission) {
        results[permission.name] = permission
      });

      callback(results);
    });
  });

  return mongoose.model('Permission', PermissionSchema);
}) ();
