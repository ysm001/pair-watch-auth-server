module.exports = (function() {
  var mongoose = require('mongoose');

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
   * 指定した複数のpermissionをbit flagに変換するメソッド
   *
   * @method toBitFlags
   * @param {[Permission]} permissions permissionの配列
   * @return {Integer} bit flag
   */
  PermissionSchema.static('toBitFlag', function(permissions) {
    return permissions
    .map(function(permission) {return permission.flag})
    .reduce(function(prev, cur) {return cur | prev}, 0);
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
    var flag = this.toBitFlag(permissions);

    return requiredPermissions.every(function(requiredPermission) {
      return (requiredPermission.flag & flag) != 0
    })
  })

  /**
   * DB内の全てのPermissionを読み込むメソッド (デバッグ用)
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
