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

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`[MIGRATE] Found ${migrationFiles.length} migration file(s):`, migrationFiles);

    for (const file of migrationFiles) {
      const sqlPath = path.join(migrationsDir, file);
      console.log(`[MIGRATE] Executing migration: ${file}...`);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await connection.query(sql);
      console.log(`[MIGRATE] ✅ ${file} applied successfully.`);
    }

    console.log('[MIGRATE] 🎉 All migrations completed successfully!');
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
