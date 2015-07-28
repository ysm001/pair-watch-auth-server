module.exports = (function() {
  var logger = require('../../lib/logger.js');
  var LoggerHelper = function() {}

  LoggerHelper.setLevel = function(level) {
    logger.remove(logger.transports.Console);
    logger.add(logger.transports.Console, { level: level, colorize:true });
  }

  return LoggerHelper;
})();
