const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');
var configResolve = require("../common/configResolver");
const env = configResolve.getConfig().env;
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const logger = caller => {
  return createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label: path.basename(caller) }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        )
      }),
      new transports.File({
        filename,
        format: format.combine(
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        )
      })
    ]
  });
};

logger.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      console.info(message);
    },
  };

module.exports = logger;