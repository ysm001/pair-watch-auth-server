module.exports = (function() {
  var mongoose = require('mongoose');
  var Role = require('./role.js');

  /**
   * User Model
   *
   * @class UserSchema
   * @constructor
   */
  var UserSchema = new mongoose.Schema({
    name: {type: String},
    deviceId: {type: String, unique: true},
    role: {type: mongoose.Schema.ObjectId, ref: 'Role'}
  });
  

  /**
   * 指定したpermissionを満たす権限を持つUserを検索するメソッド
   *
   * @method findByPermissions
   * @param {[Permission]} permissions permissionの配列
   * @param {Function} callback callback
   */
  UserSchema.static('findByPermissions', function(permissions, callback) {
    var self = this;

    Role.findByPermissions(permissions, function(err, roles) {
      var roleIds = roles.map(function(role) {return role._id});
      self.find({role: {$in: roleIds}}, callback);
    });
  });

  UserSchema.static('findByDeviceIds', function(deviceIds, callback) {
    var condition = deviceIds.map(function(id) {return {deviceId: id}})
    this.find({$or: condition}, callback)
  });

  /**
   * Userが、指定したpermissionを満たす権限を持つかを検査するメソッド
   *
   * @method hasEnoughPermissions
   * @param {[Permission]} permissions permissionの配列
   * @param {Function} callback callback
   */
  UserSchema.method('hasEnoughPermissions', function(permissions, callback) {
    var self = this;

    this.model('User').findByPermissions(permissions, function(err, users) {
      var result = users.some(function(user) {return user._id.equals(self._id)});
      callback(err, result, users);
    });
  });

  /**
   * Userが、指定したpermissionを満たす権限を持つかを検査するメソッド(単数版)
   *
   * @method hasEnoughPermission
   * @param {Permission} permissions permission
   * @param {Function} callback callback
   */
  UserSchema.method('hasEnoughPermission', function(permission, callback) {
    this.hasEnoughPermissions([permission], callback);
  });

  return mongoose.model('User', UserSchema);
}) ();
