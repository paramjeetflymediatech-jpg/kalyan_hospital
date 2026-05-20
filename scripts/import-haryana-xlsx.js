import xlsx from 'xlsx';
import State from '../src/models/State.js';
import District from '../src/models/District.js';
import Location from '../src/models/Location.js';

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

async function main() {
  try {
    console.log('Opening scripts/cities.xlsx...');
    const workbook = xlsx.readFile('scripts/cities.xlsx');
    
    // 1. Ensure Jammu and Kashmir State exists
    const [JammuAndKashmirState] = await State.findOrCreate({
      where: { slug: 'jammu-and-kashmir' },
      defaults: { name: 'Jammu and Kashmir', slug: 'jammu-and-kashmir', is_active: true }
    });
    console.log(`Using Jammu and Kashmir State ID: ${JammuAndKashmirState.id}`);

    let processedCount = 0;
    let addedCount = 0;

    for (const sheetName of workbook.SheetNames) {
      console.log(`\nReading Sheet: ${sheetName}...`);
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

      for (const row of data) {
        if (!row || row.length < 4) continue;
        
        // Skip header rows
        if (row[0] === 'Sr No' || row[2] === 'District') continue;

        const stateName = row[1]?.toString().trim();
        let districtName = row[2]?.toString().trim();
        const cityName = row[3]?.toString().trim();
        console.log(stateName.toLowerCase(), 'stateName');

        if (!cityName || stateName?.toLowerCase() !== 'jammu & kashmir') continue;

        // Ensure District exists under Jammu and Kashmir
        const [district] = await District.findOrCreate({
          where: { state_id: JammuAndKashmirState.id, name: districtName },
          defaults: { name: districtName, state_id: JammuAndKashmirState.id }
        });

        const baseSlug = slugify(cityName);
        
        // Handle slug collision
        const existingLoc = await Location.findOne({ where: { slug: baseSlug } });
        let finalSlug = baseSlug;
        if (existingLoc && existingLoc.state_id !== JammuAndKashmirState.id) {
          finalSlug = `${baseSlug}-jammu-and-kashmir`;
          console.log(`  ⚠️ Slug collision for '${cityName}': '${baseSlug}' already exists in another state. Using '${finalSlug}'`);
        }

        // Ensure Location exists
        const [location, created] = await Location.findOrCreate({
          where: { slug: finalSlug },
          defaults: {
            name: cityName,
            slug: finalSlug,
            state_id: JammuAndKashmirState.id,
            district_id: district.id
          }
        });

        if (created) {
          addedCount++;
          console.log(`  + Created: ${cityName} -> District: ${districtName} (Slug: ${finalSlug})`);
        } else {
          // Update location properties if mismatched
          if (location.state_id !== JammuAndKashmirState.id || location.district_id !== district.id) {
            await location.update({
              state_id: JammuAndKashmirState.id,
              district_id: district.id
            });
            console.log(`  ~ Updated: ${cityName} -> District: ${districtName}`);
          }
        }
        processedCount++;
      }
    }

    console.log(`\n✅ Done! Processed ${processedCount} rows.`);
    console.log(`Added ${addedCount} new locations.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
