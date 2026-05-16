import fs from 'fs';
import path from 'path';
import Service from '../src/models/Service.js';
import Location from '../src/models/Location.js';
import State from '../src/models/State.js';
import ServiceLocation from '../src/models/ServiceLocation.js';
import Seo from '../src/models/Seo.js';
import dotenv from 'dotenv';

dotenv.config();

async function insertServiceLocations() {
  let cityarr=[]
  try {
    // Path to your JSON file
    const jsonPath = path.join(process.cwd(), 'scripts/service_content.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ JSON file not found at: ${jsonPath}`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`🚀 Starting import of ${data.length} service locations...`);

    // Robust Service Lookup
    const serviceName = 'Robotic Knee Replacement';
    let service = await Service.findOne({ 
      where: { name: serviceName } 
    });

    if (!service) {
      // Try slug fallback
      service = await Service.findOne({ 
        where: { slug: 'robotic-knee-replacement' } 
      });
    }

    if (!service) {
      console.error(`❌ Service "${serviceName}" not found in database.`);
      const allServices = await Service.findAll();
      console.log('Available services in DB:', allServices.map(s => `"${s.name}" (${s.slug})`).join(', '));
      return;
    }
    console.log(`✅ Using Service: ${service.name} (ID: ${service.id})`);

    for (const item of data) {
      console.log(`\n📦 Processing: ${item.city}...`);

      // 1. Find Location and State
      const location = await Location.findOne({ 
        where: { name: item.city },
        include: [{ model: State, where: { name: item.state || 'Punjab' } }]
      });

      if (!location) {
        cityarr.push(item.city)
        console.warn(`⚠️ Location "${item.city}" not found in database. Skipping.`);
        continue;
      }

      // 2. Insert/Update ServiceLocation Junction
      const [junction, jCreated] = await ServiceLocation.findOrCreate({
        where: { service_id: service.id, location_id: location.id },
        defaults: {
          service_id: service.id,
          location_id: location.id,
          description: item.meta_description,
          content: item.content,
          faqs: JSON.stringify(item.faqs)
        }
      });

      if (!jCreated) {
        await junction.update({
          description: item.meta_description,
          content: item.content,
          faqs: JSON.stringify(item.faqs)
        });
        console.log(`✅ Updated ServiceLocation junction.`);
      } else {
        console.log(`➕ Created ServiceLocation junction.`);
      }

      // 3. Insert/Update SEO Metadata
      const pagePath = item.path || `/${location.State.slug}/${service.slug}-in-${location.slug}`;
      
      const [seo, sCreated] = await Seo.findOrCreate({
        where: { page_path: pagePath },
        defaults: {
          page_path: pagePath,
          title: item.meta_title,
          description: item.meta_description,
          keywords: item.keywords,
          og_title: item.og_title || item.meta_title,
          og_description: item.og_description || item.meta_description,
          canonical_url: item.canonical_url,
          og_image: item.og_image
        }
      });

      if (!sCreated) {
        await seo.update({
          title: item.meta_title,
          description: item.meta_description,
          keywords: item.keywords,
          og_title: item.og_title || item.meta_title,
          og_description: item.og_description || item.meta_description,
          canonical_url: item.canonical_url,
          og_image: item.og_image
        });
        console.log(`✅ Updated SEO metadata for: ${pagePath}`);
      } else {
        console.log(`➕ Created SEO metadata for: ${pagePath}`);
      }
    }

    console.log('\n✨ All data has been successfully synchronized with the database!');
    console.log('City array:', cityarr);
    process.exit(0);
  } catch (error) {
    console.error('❌ Critical Error during insertion:', error);
    process.exit(1);
  }
}

insertServiceLocations();
