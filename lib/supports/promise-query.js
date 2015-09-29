'use strict';

const Promise = require('bluebird');
const RecordNotFoundError = require('../errors/record-not-found-error.js');

module.exports = function(query) {
  return new Promise(function(resolve, reject) {
    query.exec().then(function(result) {
      if (!result || (result instanceof Array && result.length === 0)) {
        reject(new RecordNotFoundError(query.model.modelName, query._conditions));
      }

      resolve(result);
    }).onReject(function(err) {
      reject(err);
    });
  });
};
