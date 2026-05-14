import State from '../src/models/State.js';
import Location from '../src/models/Location.js';

async function fixData() {
  try {
    const punjab = await State.findOne({ where: { slug: 'punjab' } });
    if (!punjab) {
      console.log('Punjab state not found');
      return;
    }

    const locations = await Location.findAll();
    for (const loc of locations) {
      if (!loc.state_id) {
        console.log(`Updating ${loc.name} with state_id: ${punjab.id}`);
        await loc.update({ state_id: punjab.id });
      }
    }
    console.log('Data fix complete');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

fixData();
