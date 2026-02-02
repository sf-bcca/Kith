import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function reset() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Clearing database tables...');
    // TRUNCATE is faster and also resets identity counters if any (though we use UUIDs)
    // CASCADE ensures that dependent rows in 'activities' are also removed if they weren't already
    await client.query('TRUNCATE TABLE activities, family_members RESTART IDENTITY CASCADE');

    await client.query('COMMIT');
    console.log('Database cleared successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error clearing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
