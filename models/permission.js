module.exports = (function() {
  var mongoose = require('mongoose');

  var PermissionSchema = new mongoose.Schema({
    name: {type: String, unique: true},
  });

  return mongoose.model('Permission', PermissionSchema);
}) ();
