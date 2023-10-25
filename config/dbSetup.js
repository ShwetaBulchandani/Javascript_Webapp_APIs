import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';
import assignmentModel from '../models/assignmentModel.js';
import userModel from '../models/userModel.js';

// const sequelize = new Sequelize(
//   `${config.database.dialect}://${config.database.user}:${config.database.pd}@${config.database.host}/${config.database.database}`
// );

const { dialect, host, user, password, database } = config.database;

const sequelize = new Sequelize(`${dialect}://${user}:${password}@${host}/${database}`);


const db = {
  sequelize,
  assignment: assignmentModel(sequelize),
  user: userModel(sequelize),
};

export default db;
