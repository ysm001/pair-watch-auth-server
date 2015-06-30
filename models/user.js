module.exports = (function() {
  var mongoose = require('mongoose');

  var UserSchema = new mongoose.Schema({
    name: {type: String},
    deviceId: {type: String, unique: true},
    role: {type: Schema.ObjectId, ref: 'role'}
  });

  return mongoose.model('User', UserSchema);
}) ();
