module.exports = (function() {
  var mongoose = require('mongoose');

  var RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    role: [{type: Schema.ObjectId, ref: 'permissions'}]
  });

  return mongoose.model('Role', RoleSchema);
}) ();
