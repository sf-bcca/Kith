
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'kith_user',
  host: 'localhost',
  database: 'kith_db',
  password: 'kith_password',
  port: 5432,
});

async function repair() {
  const statusFile = path.resolve(__dirname, 'repair_status.txt');
  fs.writeFileSync(statusFile, 'Starting...\n');
  
  try {
    const timeRes = await pool.query('SELECT NOW()');
    fs.appendFileSync(statusFile, `Connected: ${timeRes.rows[0].now}\n`);

    const res = await pool.query("UPDATE family_members SET visibility = 'family-only' WHERE visibility IS NULL OR visibility = ''");
    fs.appendFileSync(statusFile, `Updated: ${res.rowCount}\n`);

  } catch (e) {
    fs.appendFileSync(statusFile, `Error: ${e.message}\n`);
  } finally {
    pool.end();
    fs.appendFileSync(statusFile, 'Done.\n');
  }
}

repair();
