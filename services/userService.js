import fs from 'fs';
import path from 'path';
import db from '../config/dbSetup.js';

const currentDate = new Date();
const accountCreatedString = currentDate.toISOString();
const accountUpdatedString = currentDate.toISOString();

const CSV_FILE_PATH = '/root/opt/webapp/users.csv';

const syncDatabase = async () => {
    try {
        // Sync the database to create tables if they don't exist

        await db.sequelize.sync({ force: false }); // Use force: true to recreate tables

        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing the database:', error);
        throw error; // Ensure the error is propagated
    }
};

const loadCSVData = async () => {
    try {
        // Load and insert data from CSV files
        const csvData = fs.readFileSync(path.join(CSV_FILE_PATH), 'utf-8');
        const rows = csvData.split('\n').map((row) => row.split(','));

        for (let i = 1; i < rows.length; i++) {
          const [first_name, last_name, emailid, password] = rows[i];
      
          if (!last_name || !emailid || !password) {
              console.log(`Skipping row ${i + 1} due to missing values.`);
              continue;
          }
      
          await db.user.create({
              first_name,
              last_name,
              emailid,
              password,
              account_created: accountCreatedString,
              account_updated: accountUpdatedString,
          });
      }      

        console.log('CSV data loaded and inserted successfully.');
    } catch (error) {
        console.error('Error loading CSV data:', error.message);
        throw error; // Ensure the error is propagated
    }
};

const initializeDatabase = async () => {
    try {
        await syncDatabase();
        await loadCSVData();

        console.log('Database bootstrapped successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error.message);
    }
};

export default initializeDatabase;
