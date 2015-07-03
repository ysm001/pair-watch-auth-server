module.exports = (function() {
  var mongoose = require('mongoose');
  var Role = require('./role.js');

  var UserSchema = new mongoose.Schema({
    name: {type: String},
    deviceId: {type: String, unique: true},
    role: {type: mongoose.Schema.ObjectId, ref: 'Role'}
  });
  
  UserSchema.static('findByPermissions', function(permissions, callback) {
    var self = this;

    Role.findByPermissions(permissions, function(err, roles) {
      var roleIds = roles.map(function(role) {return role._id});
      self.find({role: {$in: roleIds}}, callback);
    });
  });

  UserSchema.method('hasEnoughPermissions', function(permissions, callback) {
    var self = this;

    this.model('User').findByPermissions(permissions, function(err, users) {
      var result = users.some(function(user) {return user._id.equals(self._id)});
      callback(err, result, users);
    });
  });

  UserSchema.method('hasEnoughPermission', function(permission, callback) {
    this.hasEnoughPermissions([permission], callback);
  });

  return mongoose.model('User', UserSchema);
}) ();
