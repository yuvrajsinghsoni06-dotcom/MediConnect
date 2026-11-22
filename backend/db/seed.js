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
  database: process.env.DB_NAME || 'mediconnect_db',
  multipleStatements: true
};

async function runSeed() {
  console.log('[SEED] Connecting to MySQL database at', `${config.host}:${config.port}/${config.database}...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[SEED] Connected successfully.');

    const sqlPath = path.join(__dirname, 'seeds', '001_synthetic_seed_data.sql');
    console.log('[SEED] Reading seed file:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[SEED] Inserting synthetic seed data...');
    await connection.query(sql);
    console.log('[SEED] ✅ Seeding completed successfully! Synthetic datasets populated across all 13 tables.');
  } catch (err) {
    console.error('[SEED] ❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSeed();
