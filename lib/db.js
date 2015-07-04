var db = require('mongoose');

var config = require('../config/db.json')['development'];
db.connect('mongodb://' + config['host'] + '/' + config['database']);

module.exports = db;
