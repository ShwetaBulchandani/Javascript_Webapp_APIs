import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';
import assignmentModel from '../models/assignmentModel.js';
import userModel from '../models/userModel.js';
import submissionModel from '../models/submissionModel.js';

// const sequelize = new Sequelize(
//   `${config.database.dialect}://${config.database.user}:${config.database.pd}@${config.database.host}/${config.database.database}`
// );

const { dialect, host, user, password, database } = config.database;

const sequelize = new Sequelize(`${dialect}://${user}:${password}@${host}/${database}`);


// const port = 8080;
// const host = 'localhost';
// const user = 'root';
// const password = 'admin123';
// const database = 'assignment1_db';
// const dialect = 'mysql';


// const sequelize = new Sequelize(
//   `${dialect}://${user}:${password}@${host}/${database}`
// );

const db = {
  sequelize,
  assignment: assignmentModel(sequelize),
  user: userModel(sequelize),
  submission: submissionModel(sequelize),
};

export default db;