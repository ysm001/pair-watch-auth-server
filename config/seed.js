(function() {
  var db = require('../lib/db.js');

  var insert = function(modelName, data) {
    var model = db.model('Role');

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

  var insertSeedData = function() {
    insert('Role', [
      {name: 'admin'},
      {name: 'user'}
    ]);
  }

  insertSeedData();
  console.log('Seed data is inserted. Please press Ctrl+C');
})();
