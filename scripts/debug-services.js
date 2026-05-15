import Service from '../src/models/Service.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkServices() {
  try {
    const services = await Service.findAll();
    console.log('--- Current Services in DB ---');
    services.forEach(s => {
      console.log(`ID: ${s.id} | Name: "${s.name}" | Slug: "${s.slug}"`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkServices();
