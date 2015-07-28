var express = require('express');
var User = require('../models/user.js');

module.exports = (function() {
  return {
    list: function(req, res) {
      User.find({}, function(err, users) {
        if (err) console.log(err);
        var response = users.map(function(user) {return {name: user.name, id: user.deviceId}});

        res.send(response)
      });
    }
  };
})()
