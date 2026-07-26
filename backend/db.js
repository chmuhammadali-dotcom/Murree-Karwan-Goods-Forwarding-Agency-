const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'murree_karwan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable secure SSL connectivity if connecting to a remote cloud provider (like Aiven/Railway)
if (poolConfig.host !== 'localhost' && poolConfig.host !== '127.0.0.1') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  console.log('[Database] Remote cloud host detected. Enabling SSL encryption settings.');
}

console.log(`[Database] Initializing connection pool targeting host: ${poolConfig.host}, database: ${poolConfig.database}`);

const pool = mysql.createPool(poolConfig);

// Helper function to test database connectivity
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('[Database] Connection pool successfully established with MySQL database.');
    connection.release();
    return true;
  } catch (error) {
    console.error('[Database] Failed to connect to MySQL database:', error.message);
    console.warn('[Database] WARNING: Please ensure MySQL is installed and running, and that credentials in backend/.env are correct.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  poolConfig
};
