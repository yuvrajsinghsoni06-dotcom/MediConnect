import mysql from 'mysql2/promise';
import { config } from './environment.js';

let pool = null;
let dbConnected = false;

try {
  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
} catch (err) {
  console.warn('[DB] Failed to initialize MySQL connection pool:', err.message);
}

export async function testConnection() {
  if (!pool) return false;
  try {
    const [rows] = await pool.query('SELECT 1 AS alive');
    dbConnected = rows && rows[0] && rows[0].alive === 1;
    if (dbConnected) {
      console.log(`[DB] ✅ Connected to MySQL database '${config.db.database}' on ${config.db.host}:${config.db.port}`);
    }
    return dbConnected;
  } catch (err) {
    dbConnected = false;
    console.warn(`[DB] ⚠️ MySQL not reachable (${err.code || err.message}). Backend running with memory-synced repository fallback.`);
    return false;
  }
}

export function isDbConnected() {
  return dbConnected;
}

export async function query(sql, params = []) {
  if (!pool || !dbConnected) {
    throw new Error('DATABASE_OFFLINE');
  }
  const [results] = await pool.query(sql, params);
  return results;
}

export async function withTransaction(callback) {
  if (!pool || !dbConnected) {
    throw new Error('DATABASE_OFFLINE');
  }
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export { pool };
