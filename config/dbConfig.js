import dotenv from 'dotenv';
import logger from "./logger.js";

dotenv.config();

const {
  host,
  user,
  password,
  database,
  dialect,
  port,
  TopicArn,
} = process.env;

const databaseConfig = {
  host,
  user,
  password,
  database,
  dialect,
  port,
  TopicArn,
};

logger.info('Database configuration loaded successfully:', databaseConfig);

export default {
  database: databaseConfig,
};


