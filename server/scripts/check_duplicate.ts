
import { pool } from '../db';
import fs from 'fs';
import path from 'path';

async function checkDuplicate() {
  const logPath = path.join(__dirname, 'check_output.txt');
  try {
    const res = await pool.query(
      "SELECT id, first_name, last_name, birth_date, visibility FROM family_members WHERE first_name = 'Bryson' AND last_name = 'Flowers'"
    );
    const output = 'Found records: ' + JSON.stringify(res.rows, null, 2);
    fs.writeFileSync(logPath, output);
    console.log(output);
  } catch (error) {
    const err = 'Error: ' + error;
    fs.writeFileSync(logPath, err);
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkDuplicate();
