import { createLogger, transports, format } from "winston";
 
const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: "csye6225.log",
    }),
  ],
});
 
export default logger;