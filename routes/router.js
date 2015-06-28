module.exports = function(app, io) {
  var auth = require('./auth')(io);
  app.get('/auth/check', auth.check);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
