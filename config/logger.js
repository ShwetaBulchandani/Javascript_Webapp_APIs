const { createLogger, transports, format } = require("winston");
 
const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: "csye6225.log",
    }),
  ],
});
 
module.exports = logger;