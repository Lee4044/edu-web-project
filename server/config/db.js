import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'education',
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  acquireTimeout: 60000,
  timeout: 60000
});

export const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Please ensure MySQL is running and the database "education" exists');
    console.log('💡 You can continue without database - API will use fallback data');
    return false;
  }
};

export { pool };