
const { Pool } = require('pg');

const pool = new Pool({
  user: 'kith_user',
  host: 'localhost',
  database: 'kith_db',
  password: 'kith_password',
  port: 5432,
});

async function repair() {
  console.error('DEBUG: Starting repair...');
  try {
    // Check connection
    const timeRes = await pool.query('SELECT NOW()');
    console.error('DEBUG: DB Connected at', timeRes.rows[0].now);

    // Check Bryson
    const bryson = await pool.query("SELECT id, first_name, visibility FROM family_members WHERE first_name = 'Bryson'");
    console.error('DEBUG: Bryson before update:', JSON.stringify(bryson.rows));

    // Update visibility
    const res = await pool.query("UPDATE family_members SET visibility = 'family-only' WHERE visibility IS NULL OR visibility = ''");
    console.error(`DEBUG: Updated ${res.rowCount} records.`);

    // Check Bryson again
    const brysonAfter = await pool.query("SELECT id, first_name, visibility FROM family_members WHERE first_name = 'Bryson'");
    console.error('DEBUG: Bryson after update:', JSON.stringify(brysonAfter.rows));

  } catch (e) {
    console.error('DEBUG: Error:', e);
  } finally {
    pool.end();
  }
}

repair();
