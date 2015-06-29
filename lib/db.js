var db = require('mongoose');

var schema = require('../config/schema.js')(db);
var config = require('../config/db.json')['development'];
db.connect('mongodb://' + config['host'] + '/' + config['database']);

module.exports = db;
