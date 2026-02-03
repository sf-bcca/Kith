
import { pool } from '../db';
import fs from 'fs';
import path from 'path';

async function debugBryson() {
  const logFile = path.resolve(__dirname, 'debug_output.log');
  const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
  };

  log('DEBUG: Starting query...');
  try {
    const res = await pool.query("SELECT * FROM family_members WHERE last_name ILIKE 'Flowers'");
    log(`DEBUG: Found ${res.rows.length} records.`);
    res.rows.forEach(r => {
        log(`--- Record ---`);
        log(`ID: ${r.id}`);
        log(`Name: '${r.first_name}' '${r.last_name}'`);
        log(`BirthDate: ${r.birth_date}`);
        log(`Visibility: '${r.visibility}'`);
    });
  } catch (e) {
    log(`DEBUG: Error ${e}`);
  } finally {
    pool.end();
  }
}

debugBryson();
