import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

const checkConnection = async () => {
  try {
    if (!db) {
      db = await open({
        filename: path.join(__dirname, '..', 'database.sqlite'),
        driver: sqlite3.Database
      });
    }
    
    // Test the connection
    await db.get('SELECT 1');
    console.log('✅ SQLite database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ SQLite database connection failed:', error.message);
    throw error;
  }
};

const getDatabase = async () => {
  if (!db) {
    await checkConnection();
  }
  return db;
};

const initializeDatabase = async () => {
  try {
    await checkConnection();
    console.log('🔄 SQLite database initialized');
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error.message);
    throw error;
  }
};

export { checkConnection, getDatabase, initializeDatabase };