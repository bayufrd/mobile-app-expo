const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '192.168.1.2',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0202',
  database: process.env.DB_NAME || 'uas_mobile_students',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return 'connected';
  } catch (error) {
    return `disconnected: ${error.message}`;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};