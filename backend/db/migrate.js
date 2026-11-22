import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function runMigrations() {
  console.log('[MIGRATE] Connecting to MySQL server at', `${config.host}:${config.port}...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[MIGRATE] Connected successfully.');

    const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    console.log('[MIGRATE] Reading migration file:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[MIGRATE] Executing initial schema migration...');
    await connection.query(sql);
    console.log('[MIGRATE] ✅ Migration completed successfully! Database `mediconnect_db` and all 13 tables created.');
  } catch (err) {
    console.error('[MIGRATE] ❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();
