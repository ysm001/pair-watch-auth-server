module.exports = (function() {
  var mongoose = require('mongoose');
  var Permission = require('./permission.js');
  
  /**
   * Role Model
   *
   * @class RoleSchema
   * @constructor
   */
  var RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    permissions: [{type: mongoose.Schema.ObjectId, ref: 'Permission'}]
  });

  /**
   * 指定したpermissionを満たす権限を持つRoleを検索するメソッド
   *
   * @method findByPermissions
   * @param {[Permission]} permissions permissionの配列
   * @param {Function} callback callback
   */
  RoleSchema.static('findByPermissions', function(permissions, callback) {
    this.find({}).populate('permissions').exec(function(err, roles) {
      var results = roles.filter(function(role) {
        return Permission.hasEnoughPermissions(role.permissions, permissions);
      });

      callback(err, results);
    });
  });

  return mongoose.model('Role', RoleSchema);
}) ();
