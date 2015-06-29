module.exports = function(db) {
  db.insert('Role', [
    {name: 'admin'},
    {name: 'user'}
  ]);

  var model = db.model('Role');
  var adminRole = model.findOne({name: 'admin'});
  var userRole = model.findOne({name: 'user'});
  db.insert('User', [
    {name: 'admin', deviceId: 'admin-device-id', role: adminRole._id},
    {name: 'user', deviceId: 'user-device-id', role: userRole._id}
  ]);
}
