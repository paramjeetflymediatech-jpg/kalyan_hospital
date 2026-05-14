import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import sequelize from '../src/lib/db.js';
import Service from '../src/models/Service.js';
import Location from '../src/models/Location.js';
import State from '../src/models/State.js';

async function seed() {
  try {
    await sequelize.sync();
    console.log('✅ Tables synced');

    // 1. Seed Punjab State
    const [punjabState] = await State.findOrCreate({
      where: { slug: 'punjab' },
      defaults: { name: 'Punjab', slug: 'punjab' }
    });
    console.log('✅ Punjab State seeded');

    // 2. Seed Services
    const services = [
      { name: 'Robotic Knee Replacement', slug: 'robotic-knee-replacement', icon: 'Knee' },
      { name: 'Robotic Hip Replacement', slug: 'robotic-hip-replacement', icon: 'Hip' },
      { name: 'AI Spine Surgery', slug: 'ai-spine-surgery', icon: 'Spine' },
      { name: 'Robotic Trauma Care', slug: 'robotic-trauma-care', icon: 'Trauma' }
    ];

    for (const s of services) {
      await Service.findOrCreate({ where: { slug: s.slug }, defaults: s });
    }
    console.log('✅ Services seeded');

    // 3. Seed Punjab Locations linked to Punjab State
    const locations = [
      { name: 'Ludhiana', slug: 'ludhiana', state_id: punjabState.id },
      { name: 'Amritsar', slug: 'amritsar', state_id: punjabState.id },
      { name: 'Jalandhar', slug: 'jalandhar', state_id: punjabState.id },
      { name: 'Patiala', slug: 'patiala', state_id: punjabState.id },
      { name: 'Bathinda', slug: 'bathinda', state_id: punjabState.id },
      { name: 'Mohali', slug: 'mohali', state_id: punjabState.id }
    ];

    for (const l of locations) {
      await Location.findOrCreate({ where: { slug: l.slug }, defaults: l });
    }
    console.log('✅ Punjab Locations linked');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
