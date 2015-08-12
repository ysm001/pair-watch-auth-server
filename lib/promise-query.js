const Promise = require('bluebird')

module.exports = function(query) {
  return new Promise(function(resolve, reject) {
    query.exec().then(function(result) {
      resolve(result);
    }).onReject(function(err) {
      reject(err);
    });
  });
}
