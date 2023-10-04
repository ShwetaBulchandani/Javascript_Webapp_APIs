import dotenv from 'dotenv';

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

export default {
  database: databaseConfig,
};


