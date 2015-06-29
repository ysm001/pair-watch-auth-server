module.exports = function(db) {
  var Schema = db.Schema;

  var RoleSchema = new Schema({
    name: {type: String, unique: true}
  });
  db.model('Role', RoleSchema);
}
