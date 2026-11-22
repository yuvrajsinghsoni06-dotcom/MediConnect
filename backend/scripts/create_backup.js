import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection, query } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBackup() {
  await testConnection();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../db/backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupFile = path.join(backupDir, `mediconnect_db_backup_${timestamp}.sql`);

  const tables = [
    'users',
    'donors',
    'donor_assessments',
    'donor_deferrals',
    'blood_donations',
    'blood_components',
    'screening_test_catalogue',
    'laboratory_test_results',
    'clinical_reviews',
    'emergency_requests',
    'campaigns',
    'confidential_follow_ups',
    'audit_logs'
  ];

  let sqlDump = `-- MediConnect Database Backup\n-- Generated: ${new Date().toISOString()}\n\nSET FOREIGN_KEY_CHECKS=0;\n\n`;

  for (const table of tables) {
    // Get create table statement
    const [createRes] = await query(`SHOW CREATE TABLE \`${table}\``);
    const createSql = createRes['Create Table'];
    sqlDump += `-- Table structure for table \`${table}\`\n`;
    sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n${createSql};\n\n`;

    // Dump rows
    const rows = await query(`SELECT * FROM \`${table}\``);
    if (rows.length > 0) {
      sqlDump += `-- Dumping data for table \`${table}\` (${rows.length} rows)\n`;
      for (const row of rows) {
        const keys = Object.keys(row).map(k => `\`${k}\``).join(', ');
        const values = Object.values(row).map(val => {
          if (val === null) return 'NULL';
          if (typeof val === 'number') return val;
          if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
          if (typeof val === 'boolean') return val ? 1 : 0;
          return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        }).join(', ');
        sqlDump += `INSERT INTO \`${table}\` (${keys}) VALUES (${values});\n`;
      }
      sqlDump += '\n';
    }
  }

  sqlDump += `SET FOREIGN_KEY_CHECKS=1;\n`;

  fs.writeFileSync(backupFile, sqlDump, 'utf8');
  const stats = fs.statSync(backupFile);
  console.log(`[BACKUP] ✅ Backup created successfully: ${backupFile} (${stats.size} bytes)`);
  process.exit(0);
}

runBackup().catch(err => {
  console.error('[BACKUP] ❌ Failed to create backup:', err);
  process.exit(1);
});
