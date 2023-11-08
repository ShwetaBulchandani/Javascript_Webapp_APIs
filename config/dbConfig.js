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
} = process.env;

const databaseConfig = {
  host,
  user,
  password,
  database,
  dialect,
  port,
};

logger.info('Database configuration loaded successfully:', databaseConfig);

export default {
  database: databaseConfig,
};


