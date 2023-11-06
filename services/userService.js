import fs from 'fs';
import path from 'path';
import db from '../config/dbSetup.js';
import logger from '../config/dbSetup.js';

const currentDate = new Date();
const accountCreatedString = currentDate.toISOString();
const accountUpdatedString = currentDate.toISOString();

const CSV_FILE_PATH = '/opt/csye6225/users.csv';

const syncDatabase = async () => {
    try {
        await db.sequelize.sync({ alter: false }); 
        logger.info('Database synced successfully.');

        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing the database:', error);
        logger.error(`Error syncing the database: ${error.message}`);
        throw error;
    }
};

const loadCSVData = async () => {
    try {
        // Load and insert data from CSV files
        const csvData = fs.readFileSync(path.join(CSV_FILE_PATH), 'utf-8');
        const rows = csvData.split(/\r?\n/).map((row) => row.split(','));
        console.log("data", rows);

        for (let i = 1; i < rows.length; i++) {
          const [first_name, last_name, emailid, password] = rows[i];
      
          if (!first_name || !last_name || !emailid || !password) {
              continue;
          } else {
          await db.user.create({
              first_name,
              last_name,
              emailid,
              password,
              account_created: accountCreatedString,
              account_updated: accountUpdatedString,
          });
        }
      }      

        console.log('CSV data loaded and inserted successfully.');
        logger.info('CSV data loaded and inserted successfully.');
    } catch (error) {
        console.error('Error loading CSV data:', error.message);
        logger.error(`Error loading CSV data: ${error.message}`);
        throw error; // Ensure the error is propagated
    }
};

const initializeDatabase = async () => {
    try {
        await syncDatabase();
        await loadCSVData();

        console.log('Database bootstrapped successfully.');
        logger.info('Database bootstrapped successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error.message);
        logger.error(`Error initializing the database: ${error.message}`);
    }
};

export default initializeDatabase;
