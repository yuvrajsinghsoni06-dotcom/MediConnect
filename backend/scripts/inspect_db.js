import { testConnection, query } from '../src/config/db.js';

async function inspect() {
  await testConnection();
  const tables = [
    'users', 'donors', 'donor_assessments', 'donor_deferrals',
    'blood_donations', 'blood_components', 'screening_test_catalogue',
    'laboratory_test_results', 'clinical_reviews', 'emergency_requests',
    'campaigns', 'confidential_follow_ups', 'audit_logs'
  ];
  for (const t of tables) {
    const [res] = await query(`SELECT COUNT(*) as cnt FROM \`${t}\``);
    console.log(`${t.padEnd(26)} : ${res.cnt} rows`);
  }
  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
