import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';
import assignmentModel from '../models/assignmentModel.js';
import userModel from '../models/userModel.js';

// const sequelize = new Sequelize(
//   `${config.database.dialect}://${config.database.user}:${config.database.pd}@${config.database.host}/${config.database.database}`
// );

const winston = require("winston");
const StatsD = require('node-statsd');

const statsdClient = new StatsD();

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'csye6225.log'})],
});

 
module.exports = appLogger;
const { dialect, host, user, password, database } = config.database;

const sequelize = new Sequelize(`${dialect}://${user}:${password}@${host}/${database}`);


const db = {
  sequelize,
  assignment: assignmentModel(sequelize),
  user: userModel(sequelize),
};

export { db, logger, statsdClient };