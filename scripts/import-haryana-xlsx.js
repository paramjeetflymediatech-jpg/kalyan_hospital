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
    
    // 1. Ensure Himachal Pradesh State exists
    const [HimachalPradeshState] = await State.findOrCreate({
      where: { slug: 'himachal-pradesh' },
      defaults: { name: 'Himachal Pradesh', slug: 'himachal-pradesh', is_active: true }
    });
    console.log(`Using Himachal Pradesh State ID: ${HimachalPradeshState.id}`);

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

        if (!cityName || stateName?.toLowerCase() !== 'himachal pradesh') continue;

        // Ensure District exists under Himachal Pradesh
        const [district] = await District.findOrCreate({
          where: { state_id: HimachalPradeshState.id, name: districtName },
          defaults: { name: districtName, state_id: HimachalPradeshState.id }
        });

        const baseSlug = slugify(cityName);
        
        // Handle slug collision
        const existingLoc = await Location.findOne({ where: { slug: baseSlug } });
        let finalSlug = baseSlug;
        if (existingLoc && existingLoc.state_id !== HimachalPradeshState.id) {
          finalSlug = `${baseSlug}-himachal-pradesh`;
          console.log(`  ⚠️ Slug collision for '${cityName}': '${baseSlug}' already exists in another state. Using '${finalSlug}'`);
        }

        // Ensure Location exists
        const [location, created] = await Location.findOrCreate({
          where: { slug: finalSlug },
          defaults: {
            name: cityName,
            slug: finalSlug,
            state_id: HimachalPradeshState.id,
            district_id: district.id
          }
        });

        if (created) {
          addedCount++;
          console.log(`  + Created: ${cityName} -> District: ${districtName} (Slug: ${finalSlug})`);
        } else {
          // Update location properties if mismatched
          if (location.state_id !== HimachalPradeshState.id || location.district_id !== district.id) {
            await location.update({
              state_id: HimachalPradeshState.id,
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
