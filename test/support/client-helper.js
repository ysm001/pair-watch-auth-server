module.exports = (function() {
  var spawn = require('child_process').spawn;

  var ClientHelper = function() {};

  ClientHelper.spawn = function(name) {
    var file = 'scripts/client-emulator/client.js'

    var client = spawn('node', [file, name]);
    client.stdout.on('data', function (data) {
        // console.log(name + ': ' + data);
    });

    client.stderr.on('data', function (data) {
        console.log(name + ': ' + data);
    });

    return client;
  };

  ClientHelper.doTestWithUsers = function(users, testFunction) {
    var clients = users.map(function(user) {ClientHelper.spawn(user)});

    setTimeout(function() {
      testFunction(clients);
    }, 1000);
  };

  return ClientHelper;
})();
