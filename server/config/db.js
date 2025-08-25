import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'education',
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error.message);
    throw error;
  }
};

const getDatabase = () => {
  return pool;
};

const initializeDatabase = async () => {
  try {
    await checkConnection();
    console.log('🔄 MySQL database initialized');
  } catch (error) {
    console.error('Failed to initialize MySQL database:', error.message);
    throw error;
  }
};

export { pool, checkConnection, getDatabase, initializeDatabase };