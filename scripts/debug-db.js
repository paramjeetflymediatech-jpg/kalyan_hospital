const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('DESCRIBE seo_metadata');
    console.log('Columns in seo_metadata:');
    console.table(rows.map(r => ({ Field: r.Field, Type: r.Type })));
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
