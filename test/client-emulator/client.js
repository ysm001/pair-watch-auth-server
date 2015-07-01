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

var generateResponse = function(token, value) {
  return {
    token: token,
    value: value
  }
}

var generateDistanceResponse = function(token, target, distance) {
  return generateResponse(token, {
    id: uid,
    'target-id': target,
    value: distance
  });
}

socket.on('request', function(data) {
  console.log(data);

  var response = null;
  switch (data.request) {
    case 'distance':
      response = generateDistanceResponse(data.token, 'ADMIN-USER-A', 100);
      break;
    case 'check-pairing':
      response = generateResponse(data.token, {result: true});
      break;
  }

  socket.emit('response', response);
});
