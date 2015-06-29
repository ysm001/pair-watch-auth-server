(function() {
  var db = require('../lib/db.js');

  var insert = function(modelName, data) {
    var model = db.model(modelName);

    data.forEach(function(kv) {
      var instance = new model();

      for (var key in kv) {
        var value = kv[key]
        eval("instance." + key + "= value");
      }

      console.log(instance);
      instance.save(function(err) {
        if (err) console.log(err);
      });
    })
  }

  var insertRoleData = function() {
    insert('Role', [
      {name: 'admin'},
      {name: 'user'}
    ]);
  }

  var insertUserData = function() {
    var model = db.model('Role');
    var adminRole = model.findOne({name: 'admin'});
    var userRole = model.findOne({name: 'user'});

    insert('User', [
      {name: 'admin', deviceId: 'admin-device-id', role: adminRole._id},
      {name: 'user', deviceId: 'user-device-id', role: userRole._id}
    ]);
  }

  var insertSeedData = function() {
    insertRoleData();
    insertUserData();
  }

  insertSeedData();
  console.log('Seed data is inserted. Please press Ctrl+C');
})();
