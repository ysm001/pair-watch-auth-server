var db = require('../lib/db.js');

var insertSeedData = function() {
  var Role = db.model('Role');
  var role = new Role();
  role.name = "admin";
  role.save(function(err) {if(err) {console.log(err);}});
}

insertSeedData();
console.log('Seed data is inserted. Please press Ctrl+C');
