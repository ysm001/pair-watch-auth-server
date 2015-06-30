module.exports = (function() {
  var mongoose = require('mongoose');
  var Permission = require('./permission.js');

  var RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    permissions: [{type: mongoose.Schema.ObjectId, ref: 'Permission'}]
  });

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
