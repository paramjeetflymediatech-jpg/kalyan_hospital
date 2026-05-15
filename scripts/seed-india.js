import State from '../src/models/State.js';
import District from '../src/models/District.js';

const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

async function seedIndiaData() {
  console.log('Fetching India states and districts data...');
  try {
    const response = await fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
    const data = await response.json();

    for (const stateData of data.states) {
      const stateName = stateData.state;
      const stateSlug = slugify(stateName);

      // Create or update State
      const [state, created] = await State.findOrCreate({
        where: { slug: stateSlug },
        defaults: {
          name: stateName,
          slug: stateSlug,
          is_active: true
        }
      });

      if (created) {
        console.log(`Created state: ${stateName}`);
      }

      // Create districts
      for (const districtName of stateData.districts) {
        await District.findOrCreate({
          where: { name: districtName, state_id: state.id },
          defaults: {
            name: districtName,
            state_id: state.id
          }
        });
      }
      console.log(`Processed districts for ${stateName}`);
    }

    console.log('Successfully seeded all states and districts!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding India data:', error);
    process.exit(1);
  }
}

seedIndiaData();
