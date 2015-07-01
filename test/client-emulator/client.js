var io = require('socket.io-client');
var config = require('../../config/server.json').development;
var url = "http://localhost:" + config.port;
var uid = process.argv[2];

var options = {
  'force new connection':true,
};

socket = io.connect(url, options);

socket.on('connect', function (data) {
  console.log("connected!");
  socket.emit("register-id", {"id": uid})
});

socket.on('disconnect', function() {
  console.log("disconnected!");
});

var responseGenerator = function (token, target, distance) {
  return {
    token: token,
    value: {
      distance: {
        id: uid,
        'target-id': target,
        value: distance
      }
    }
  }
}
socket.on('request', function(data) {
  console.log(data);

  if (data.request == 'distance') {
    var response = responseGenerator(data.token, 'ADMIN-USER-A', 100);
    socket.emit('response', response);
  }
});
