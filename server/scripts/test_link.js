
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

async function testLink() {
  const logFile = path.resolve(__dirname, 'test_link_output.log');
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
  };

  log('DEBUG: Starting link test...');
  try {
    // 1. Find a parent and a potential child (Bryson)
    const brysonRes = await pool.query("SELECT * FROM family_members WHERE first_name = 'Bryson' LIMIT 1");
    if (brysonRes.rows.length === 0) {
      log('Bryson not found');
      return;
    }
    const bryson = brysonRes.rows[0];
    log(`Found Bryson (Child): ${bryson.id}`);

    // Get any other member to act as parent
    const parentRes = await pool.query("SELECT * FROM family_members WHERE id != $1 LIMIT 1", [bryson.id]);
    if (parentRes.rows.length === 0) {
        log('No parent found');
        return;
    }
    const parent = parentRes.rows[0];
    log(`Found Parent: ${parent.id} (${parent.first_name})`);

    // 2. Simulate Link
    const memberId = parent.id;
    const relativeId = bryson.id;
    const relationshipType = 'child'; // Adding Bryson as child to Parent

    // Determine reciprocal
    const memberKey = 'children';
    const relativeKey = 'parents';

    log(`Linking ${relativeId} as ${relationshipType} (key: ${memberKey}) to ${memberId}`);

    // Update Parent
    const q1 = await pool.query(
      `UPDATE family_members 
       SET relationships = jsonb_set(
         COALESCE(relationships, '{}')::jsonb,
         '{${memberKey}}',
         COALESCE(relationships->'${memberKey}', '[]')::jsonb || $1::jsonb
       )
       WHERE id = $2 RETURNING relationships`,
      [JSON.stringify([relativeId]), memberId]
    );
    log(`Updated Parent: ${JSON.stringify(q1.rows[0]?.relationships)}`);

    // Update Child
    const q2 = await pool.query(
        `UPDATE family_members 
         SET relationships = jsonb_set(
           COALESCE(relationships, '{}')::jsonb,
           '{${relativeKey}}',
           COALESCE(relationships->'${relativeKey}', '[]')::jsonb || $1::jsonb
         )
         WHERE id = $2 RETURNING relationships`,
        [JSON.stringify([memberId]), relativeId]
      );
      log(`Updated Child: ${JSON.stringify(q2.rows[0]?.relationships)}`);

  } catch (e) {
    log(`DEBUG: Error ${e}`);
  } finally {
    pool.end();
  }
}

testLink();
