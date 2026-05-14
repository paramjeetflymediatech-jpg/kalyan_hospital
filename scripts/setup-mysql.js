const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setupDatabase() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

  console.log('🚀 Connecting to MySQL at:', config.host);

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully.');

    // 1. Appointments Table
    console.log('⏳ Creating appointments table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        internal_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Testimonials Table
    console.log('⏳ Creating testimonials table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        google_review_id VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        text TEXT,
        image VARCHAR(512),
        score VARCHAR(50),
        rating DECIMAL(3, 1),
        time VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 3. SEO Metadata Table
    console.log('⏳ Creating seo_metadata table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS seo_metadata (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_path VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255),
        description TEXT,
        keywords TEXT,
        og_image VARCHAR(512),
        og_title VARCHAR(512),
        og_description TEXT,
        header_scripts TEXT,
        footer_scripts TEXT,
        canonical_url VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 4. Users Table
    console.log('⏳ Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 5. Initial Data
    console.log('⏳ Inserting initial data...');
    await connection.execute(`
      INSERT IGNORE INTO seo_metadata (page_path, title, description)
      VALUES ('GLOBAL', 'Kalyan Robotic Hospital', 'India’s premier destination for AI-powered robotic knee replacement and spine surgery.')
    `);

    await connection.execute(`
      INSERT IGNORE INTO users (email, password, role)
      VALUES ('admin@hospital.com', 'AdminPassword123!', 'admin')
    `);

    console.log('\n✨ MySQL Database Setup Complete!');
    console.log('📧 Admin Email:    admin@hospital.com');
    console.log('🔑 Admin Password: AdminPassword123!');
    console.log('\n----------------------------------------\n');

    await connection.end();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
