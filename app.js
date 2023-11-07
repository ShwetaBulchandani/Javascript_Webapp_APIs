import express from "express";
import cors from "cors";
import route from "./routes/index.js";
import initializeDatabase from './services/userService.js';
import logger from "./config/logger.js";

const app = express();
app.use(cors());
app.use(express.json());

// Log information about the routes being set up
logger.info('Setting up routes...');
route(app);
logger.info('Routes set up successfully.');


// Log information about initializing the database
logger.info('Initializing the database...');
initializeDatabase();
logger.info('Database initialized successfully.');

export default app;


