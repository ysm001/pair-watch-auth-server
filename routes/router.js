module.exports = function(app, io) {
  var watchAuth = require('./watch-auth')(io);
  app.get('/auth', watchAuth.auth);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
