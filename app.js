import express from "express";
import cors from "cors";
import route from "./routes/index.js";
import initializeDatabase from './services/userService.js';

const app = express();
app.use(cors());
app.use(express.json());
route(app);

initializeDatabase();
export default app;


