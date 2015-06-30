module.exports = function(db) {
  var Schema = db.Schema;

  var PermissionSchema = new Schema({
    name: {type: String, unique: true},
  });
  db.model('Permission', PermissionSchema);

  var RoleSchema = new Schema({
    name: {type: String, unique: true},
    role: [{type: Schema.ObjectId, ref: 'permissions'}]
  });
  db.model('Role', RoleSchema);

  var UserSchema = new Schema({
    name: {type: String},
    deviceId: {type: String, unique: true},
    role: {type: Schema.ObjectId, ref: 'role'}
  });
  db.model('User', UserSchema);
}
