module.exports = function(app, io) {
  var watchAuth = require('./watch-auth')(io);
  var user = require('./user');
  app.get('/auth', watchAuth.auth); // debug
  app.post('/auth', watchAuth.auth);
  app.get('/users', user.list);
  app.post('/distances', user.distance);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
