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

const familyMembers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Arthur',
    last_name: 'Pendragon',
    gender: 'male',
    birth_date: '1940-05-12',
    bio: 'King of Camelot',
    relationships: { spouses: ['00000000-0000-0000-0000-000000000002'], children: ['00000000-0000-0000-0000-000000000005'] }
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    first_name: 'Guinevere',
    last_name: 'Pendragon',
    gender: 'female',
    birth_date: '1942-08-23',
    relationships: { spouses: ['00000000-0000-0000-0000-000000000001'], children: ['00000000-0000-0000-0000-000000000005'] }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    first_name: 'Mordred',
    last_name: 'Pendragon',
    gender: 'male',
    birth_date: '1965-06-20',
    relationships: { parents: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'] }
  }
];

const activities = [
  {
    type: 'photo_added',
    member_id: '00000000-0000-0000-0000-000000000002',
    content: 'Found these in the attic today! Heritage collection from 1950s.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC43cinnWvwtZx1KdZEhJGqUEYE72rWAb7RhU_VbRuK7MGGQIwnZhvGn9aXCBpAumUUxifrWXkWwgxSV3CitTyWYY4gF6Vxaw8WpGkC9CTAJmlFh3_b4aCTWhnE7p5SdRfJOQiuNHoLiyOMyymedIIW6cUy-M9C8NApKOx-um73lhfj_-Yg4humKR_0qf4VgougudW_ECVtoepxHyUctHixk5nHvZru69TjVpRMjAaW-yLOnQ-X0d18Ax3kJMokq-yVtEoeqm3xCqw'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('DELETE FROM activities');
    await client.query('DELETE FROM family_members');

    console.log('Seeding family members...');
    for (const member of familyMembers) {
      await client.query(
        `INSERT INTO family_members (id, first_name, last_name, gender, birth_date, bio, relationships)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [member.id, member.first_name, member.last_name, member.gender, member.birth_date, member.bio || '', JSON.stringify(member.relationships)]
      );
    }

    console.log('Seeding activities...');
    for (const activity of activities) {
      await client.query(
        `INSERT INTO activities (type, member_id, content, image_url)
         VALUES ($1, $2, $3, $4)`,
        [activity.type, activity.member_id, activity.content, activity.image_url]
      );
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
