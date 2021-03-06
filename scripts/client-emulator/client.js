var io = require('socket.io-client');
var isTestMode = !!process.argv[4];
var configJSON = require('../../config/server.json');
var config = isTestMode ? configJSON.test : configJSON.development;
var url = "http://localhost:" + config.port;
var uid = process.argv[2];
var disableBeacon = !!process.argv[3];
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
    'source-id': uid,
    'target-id': target,
    distance: distance
  });
}

var distanceRequestId = 'AAAAAAAA-BBBB-AAAA-AAAA-AAAAAAAAAAAA';
var advertisingTime = 300;
var startAdvertising = function(uuid, major, minor, measuredPower) {
  var uuid = uuid
  var major = major;
  var minor = 1;
  var measuredPower = -59;

  console.log("beacon-------------------------------------------");
  console.log("uuid: " + uuid);
  console.log("major: " + major);
  console.log("minor: " + minor);
  console.log("-------------------------------------------------");
  Bleacon.startAdvertising(uuid, major, minor, measuredPower);
  setTimeout(function() {Bleacon.stopAdvertising()}, advertisingTime);
}

// TODO: advertising$BCf$K8F$P$l$?;~$NBP:v(B
var sendRequestDistanceBeacon = function(token) {
  var uuid = uid
  startAdvertising(uuid, token);
}

var sendResponseDistanceBeacon = function(token) {
  var uuid = uid
  startAdvertising(uuid, token);
}

socket.on('request', function(data) {
  console.log(data);

  switch (data.request) {
    case 'distance':
      sendRequestDistanceBeacon(data.token)
      break;
    case 'check-pairing':
      var response = generateResponse(data.token, {result: true});
      socket.emit('response', response);
      break;
    case 'ping': // $B%G%P%C%0MQ(B
      for (var i = 0; i < 8; ++i) {
        var response = generateResponse(data.token, {result: true});
        socket.emit('response', response);
      }

      break;
  }

});

socket.on('notification', function(data) {
  console.error(data);
});

if (!disableBeacon) {
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
    var distance = bleacon.proximity

    var response = generateDistanceResponse(token, uuid, distance);
    console.dir(response);

    socket.emit('response', response);
  });
} else {
  console.log("beacon is disabled");
}
