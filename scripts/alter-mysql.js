const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function alterDatabase() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

  console.log('🚀 Checking for missing columns in MySQL...');

  try {
    const connection = await mysql.createConnection(config);

    const tablesToAlter = [
      {
        table: 'seo_metadata',
        columns: [
          { name: 'header_scripts', type: 'TEXT' },
          { name: 'footer_scripts', type: 'TEXT' },
          { name: 'canonical_url', type: 'VARCHAR(512)' },
          { name: 'og_title', type: 'VARCHAR(255)' },
          { name: 'og_description', type: 'TEXT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'users',
        columns: [
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'appointments',
        columns: [
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'testimonials',
        columns: [
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'locations',
        columns: [
          { name: 'state_id', type: 'INT' },
          { name: 'district_id', type: 'INT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'districts',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'state_id', type: 'INT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'services',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'slug', type: 'VARCHAR(255) UNIQUE' },
          { name: 'description', type: 'TEXT' },
          { name: 'content', type: 'TEXT' },
          { name: 'faqs', type: 'TEXT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'videos',
        columns: [
          { name: 'youtube_id', type: 'VARCHAR(255) UNIQUE' },
          { name: 'title', type: 'VARCHAR(255)' },
          { name: 'description', type: 'TEXT' },
          { name: 'thumbnail', type: 'VARCHAR(512)' },
          { name: 'category', type: 'VARCHAR(255)' },
          { name: 'published_at', type: 'DATETIME' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'service_locations',
        columns: [
          { name: 'service_id', type: 'INT' },
          { name: 'location_id', type: 'INT' },
          { name: 'description', type: 'TEXT' },
          { name: 'content', type: 'TEXT' },
          { name: 'faqs', type: 'TEXT' }
        ]
      }
    ];

    for (const item of tablesToAlter) {
      console.log(`\nChecking table: ${item.table}`);

      // Check if table exists
      const [tableExists] = await connection.execute(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = ? AND table_name = ?
      `, [config.database, item.table]);

      if (tableExists[0].count === 0) {
        console.log(`🚀 Creating table [${item.table}]...`);
        await connection.execute(`
          CREATE TABLE ${item.table} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }

      const [columns] = await connection.execute(`DESCRIBE ${item.table}`);
      const existingColumns = columns.map(col => col.Field);

      for (const col of item.columns) {
        if (!existingColumns.includes(col.name)) {
          console.log(`➕ Adding column [${col.name}] to [${item.table}]...`);
          await connection.execute(`ALTER TABLE ${item.table} ADD COLUMN ${col.name} ${col.type}`);
        } else {
          console.log(`✅ Column [${col.name}] already exists.`);
        }
      }
    }

    console.log('\n✨ All tables are up to date!');
    await connection.end();
  } catch (error) {
    console.error('❌ Alteration failed:', error.message);
    process.exit(1);
  }
}

alterDatabase();
