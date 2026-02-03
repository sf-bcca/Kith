
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

async function debugBryson() {
  console.log('DEBUG: Starting query...');
  try {
    const res = await pool.query("SELECT * FROM family_members WHERE last_name ILIKE 'Flowers'");
    console.log(`DEBUG: Found ${res.rows.length} records.`);
    res.rows.forEach(r => {
        console.log(`--- Record ---`);
        console.log(`ID: ${r.id}`);
        console.log(`Name: '${r.first_name}' '${r.last_name}'`);
        console.log(`BirthDate: ${r.birth_date}`);
        console.log(`Visibility: '${r.visibility}'`);
    });
  } catch (e) {
    console.log(`DEBUG: Error ${e}`);
  } finally {
    pool.end();
  }
}

debugBryson();
