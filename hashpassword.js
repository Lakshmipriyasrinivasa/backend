const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

async function hashPasswords() {
  try {
    const users = await pool.query('SELECT id, password_hash FROM users');

    for (let user of users.rows) {
      const plain = user.password_hash;

      // Skip if already hashed (starts with $2a$ or $2b$)
      if (plain.startsWith("$2a$") || plain.startsWith("$2b$")) {
        console.log(`Skipping user ${user.id}, already hashed.`);
        continue;
      }

      const hashed = await bcrypt.hash(plain, 10);
      await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hashed, user.id]);
      console.log(`Updated user ${user.id}`);
    }

    console.log('All passwords hashed!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

