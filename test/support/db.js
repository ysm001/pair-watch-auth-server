'use strict';

const db = require('mongoose');
const config = require('../../config/db.json').test;

db.connect('mongodb://' + config.host + '/' + config.database);

module.exports = db;
