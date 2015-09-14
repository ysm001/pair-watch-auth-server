module.exports = (function() {
  var User = require('../../models/user.js');
  var promiseQuery = require('../../lib/promise-query.js');

  var UserHelper = function() {};
  UserHelper.users = {};

  UserHelper.init = function (done) {
    UserHelper.findAll().then(function(results) {
      UserHelper.users = results;
      done();
    });
  }

  UserHelper.getUsers = function(names) {
    return names.map(function(name) {return UserHelper.getPermission(name)});
  }

  UserHelper.getUser = function(name) {
    return UserHelper.users[name];
  }

  UserHelper.findAll = function() {
    return promiseQuery(User.find({})).then(function(users) {
      const results = {};

      users.forEach(function(user) {
        results[user.name] = user;
      });

      return results;
    });
  }

  return UserHelper
})();
