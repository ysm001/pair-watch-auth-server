module.exports = (function() {
  var mongoose = require('mongoose');
  var Role = require('./role.js');

  var UserSchema = new mongoose.Schema({
    name: {type: String},
    deviceId: {type: String, unique: true},
    role: {type: mongoose.Schema.ObjectId, ref: 'Role'}
  });
  
  UserSchema.static('findByPermission', function(permissions, callback) {
    var User = this;
    Role.findByPermission(permissions, function(err, roles) {
      var roleIds = roles.map(function(role) {return role._id});
      User.find({role: {$in: roleIds}}, callback);
    });
  });

  return mongoose.model('User', UserSchema);
}) ();
