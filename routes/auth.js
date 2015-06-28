var express = require('express');

module.exports = function(io) {
  return {
    check: function(req, res) {
      var data = {
        token: '1234'
      };

      io.emit('request-distance', data);

      res.send('respond with a resource');
    }
  };
}
