var io = require('socket.io-client');
var config = require('../../config/server.json').development;
var url = "http://localhost:" + config.port;
var uid = process.argv[2];
var Bleacon = require('bleacon');

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

  switch (data.request) {
    case 'distance':
      // TODO: send distance request
      break;
    case 'check-pairing':
      var response = generateResponse(data.token, {result: true});
      socket.emit('response', response);
      break;
  }

});

Bleacon.startScanning();
Bleacon.on('discover', function(bleacon) {
  var uuid = [
    bleacon.uuid.substring(0, 8), 
    bleacon.uuid.substring(8, 12), 
    bleacon.uuid.substring(12, 16), 
    bleacon.uuid.substring(16, 32)
  ].join('-').toUpperCase();

  var token = bleacon.major
  var distance = bleacon.rssi

  var response = generateDistanceResponse(token, uuid, distance);
  console.dir(response);

  socket.emit('response', response);
});


