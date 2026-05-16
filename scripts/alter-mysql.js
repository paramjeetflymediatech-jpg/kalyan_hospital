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

  console.log('🚀 Checking for missing tables and columns in MySQL...');

  try {
    const connection = await mysql.createConnection(config);

    const tablesToAlter = [
      {
        table: 'seo_metadata',
        columns: [
          { name: 'page_path', type: 'VARCHAR(255) UNIQUE' },
          { name: 'title', type: 'VARCHAR(255)' },
          { name: 'description', type: 'TEXT' },
          { name: 'keywords', type: 'TEXT' },
          { name: 'og_image', type: 'VARCHAR(512)' },
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
          { name: 'email', type: 'VARCHAR(255) UNIQUE NOT NULL' },
          { name: 'password', type: 'VARCHAR(255) NOT NULL' },
          { name: 'role', type: 'VARCHAR(50) DEFAULT "admin"' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'appointments',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'phone', type: 'VARCHAR(50)' },
          { name: 'email', type: 'VARCHAR(255)' },
          { name: 'service', type: 'VARCHAR(255)' },
          { name: 'message', type: 'TEXT' },
          { name: 'internal_notes', type: 'TEXT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'testimonials',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'content', type: 'TEXT' },
          { name: 'rating', type: 'INT DEFAULT 5' },
          { name: 'designation', type: 'VARCHAR(255)' },
          { name: 'image', type: 'VARCHAR(512)' },
          { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'states',
        columns: [
          { name: 'name', type: 'VARCHAR(255) UNIQUE' },
          { name: 'slug', type: 'VARCHAR(255) UNIQUE' },
          { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'districts',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'slug', type: 'VARCHAR(255)' },
          { name: 'state_id', type: 'INT' },
          { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      },
      {
        table: 'locations',
        columns: [
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'slug', type: 'VARCHAR(255) UNIQUE' },
          { name: 'state_id', type: 'INT' },
          { name: 'district_id', type: 'INT' },
          { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
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
          { name: 'image', type: 'VARCHAR(512)' },
          { name: 'faqs', type: 'TEXT' },
          { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
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
      },
      {
        table: 'blogs',
        columns: [
          { name: 'title', type: 'VARCHAR(255) NOT NULL' },
          { name: 'slug', type: 'VARCHAR(255) UNIQUE NOT NULL' },
          { name: 'excerpt', type: 'TEXT' },
          { name: 'content', type: 'LONGTEXT' },
          { name: 'image', type: 'VARCHAR(512)' },
          { name: 'author', type: 'VARCHAR(255) DEFAULT "Admin"' },
          { name: 'status', type: 'VARCHAR(50) DEFAULT "draft"' },
          { name: 'published_at', type: 'DATETIME' },
          { name: 'faqs', type: 'TEXT' },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ]
      }
    ];

    for (const item of tablesToAlter) {
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
      } else {
        console.log(`✅ Table [${item.table}] exists.`);
      }

      const [columns] = await connection.execute(`DESCRIBE ${item.table}`);
      const existingColumns = columns.map(col => col.Field);

      for (const col of item.columns) {
        if (!existingColumns.includes(col.name)) {
          console.log(`➕ Adding column [${col.name}] to [${item.table}]...`);
          await connection.execute(`ALTER TABLE ${item.table} ADD COLUMN ${col.name} ${col.type}`);
        }
      }
    }

    console.log('\n✨ All tables and columns are up to date!');
    await connection.end();
  } catch (error) {
    console.error('❌ Alteration failed:', error.message);
    process.exit(1);
  }
}

alterDatabase();
