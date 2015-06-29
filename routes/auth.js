var express = require('express');
var Auth = require('../model/auth.js');

module.exports = function(io) {
  var auth = new Auth(io);
  auth.startConnection();

  return {
    check: function(req, res) {
      auth.requestDistance(function(distance) {
        res.send(distance);
      }, 1000);
    }
  };
}
