const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
  const email = 'admin@hospital.com'; // You can change this
  const password = 'AdminPassword123!'; // You can change this

  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

  console.log('\n🚀 Starting MySQL Admin Creation...\n');

  try {
    const connection = await mysql.createConnection(config);

    // Insert or Update the admin user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [email, password, 'admin', password]
    );

    if (result.affectedRows > 0) {
      console.log('✅ Admin user created/updated successfully!');
      console.log(`📧 Email:    ${email}`);
      console.log(`🔑 Password: ${password}`);
    } else {
      console.log('ℹ️ Admin user already exists with these credentials.');
    }

    console.log('\n----------------------------------------\n');
    await connection.end();
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
