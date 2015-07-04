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

var distanceRequestId = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA';
var advertisingTime = 300;
var startAdvertising(uuid, major, minor, measuredPower) {
  var uuid = uid
  var major = token;
  var minor = 1;
  var measuredPower = -59;

  Bleacon.startAdvertising(uuid, major, minor, measuredPower);
  setTimeout(function() {Bleacon.stopAdverrising()}, advertisingTime);
}

// TODO: advertising中に呼ばれた時の対策
var sendRequestDistanceBeacon = function(token) {
  var uuid = distanceRequestId
  startAdvertising(uuid, major, token, measuredPower);
}

var sendResponseDistanceBeacon = function(token) {
  var uuid = uid
  Bleacon.startAdvertising(uuid, token, minor, measuredPower);
}

socket.on('request', function(data) {
  console.log(data);

  switch (data.request) {
    case 'distance':
      // sendRequestDistanceBeacon()
      break;
    case 'check-pairing':
      var response = generateResponse(data.token, {result: true});
      socket.emit('response', response);
      break;
  }

});

Bleacon.startScanning();
Bleacon.on('discover', function(bleacon) {
  // if (bleacon.uuid == distanceRequestId) {
  // sendResponseDistanceBeacon()
  // }

  var uuid = [
    bleacon.uuid.substring(0, 8), 
    bleacon.uuid.substring(8, 12), 
    bleacon.uuid.substring(12, 16), 
    bleacon.uuid.substring(16, 20), 
    bleacon.uuid.substring(20, 32)
  ].join('-').toUpperCase();

  var token = bleacon.major
  var distance = bleacon.rssi

  var response = generateDistanceResponse(token, uuid, distance);
  console.dir(response);

  socket.emit('response', response);
});


