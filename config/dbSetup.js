import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';
import assignmentModel from '../models/assignmentModel.js';
import userModel from '../models/userModel.js';

const { dialect, host, user, password, database } = config.database;

const sequelize = new Sequelize(`${dialect}://${user}:${password}@${host}/${database}`);

const db = {
  sequelize,
  assignment: assignmentModel(sequelize),
  user: userModel(sequelize),
};

export default db;
