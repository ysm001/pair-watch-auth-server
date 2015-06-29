module.exports = function(db) {
  var Schema = db.Schema;

  var RoleSchema = new Schema({
    name: {type: String, unique: true}
  });
  db.model('Role', RoleSchema);

  // var UserSchema = new Schema({
  //   name: {type: String},
  //   deviceId: {type: String, unique: true},
  //   role: RoleSchema
  // });
  // db.model('User', UserSchema);
}
