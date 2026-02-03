
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function repairVisibility() {
  const logFile = path.resolve(__dirname, 'repair_output.txt');
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
  };

  log('Starting repair...');
  try {
    const res = await pool.query("UPDATE family_members SET visibility = 'family-only' WHERE visibility IS NULL OR visibility = ''");
    log(`Repaired ${res.rowCount} records.`);
  } catch (e) {
    log(`Error repair: ${e}`);
  } finally {
    pool.end();
  }
}

repairVisibility();
