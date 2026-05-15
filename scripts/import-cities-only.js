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

async function getDistrictFromNominatim(cityName) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)},Punjab,India&format=json&addressdetails=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'KalyanHospitalBot/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      const address = data[0].address;
      // Prefer state_district, then county, then city/town if they are known districts
      return address.state_district || address.county || address.city || address.town;
    }
  } catch (err) {
    console.error(`Error fetching district for ${cityName}:`, err.message);
  }
  return null;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function importCities() {
  try {
    console.log('Reading cities.xlsx...');
    let workbook;
    const filenames = ['scripts/citiy.xlsx', 'scripts/cities.xlsx', 'scripts/city.xlsx'];
    for (const f of filenames) {
      try {
        workbook = xlsx.readFile(f);
        console.log(`Successfully opened ${f}`);
        break;
      } catch (e) {}
    }
    
    if (!workbook) throw new Error('Could not find cities.xlsx or citiy.xlsx');
    
    // Fetch mapping dataset
    console.log('Fetching mapping dataset...');
    const mappingRes = await fetch('https://gist.githubusercontent.com/aakash4dev/f70974a0ce7506dada01019d21305746/raw');
    const mappingData = await mappingRes.json();

    const [punjabState] = await State.findOrCreate({
      where: { slug: 'punjab' },
      defaults: { name: 'Punjab', slug: 'punjab', is_active: true }
    });

    const districts = await District.findAll({ where: { state_id: punjabState.id } });
    const districtNames = districts.map(d => d.name.toLowerCase());

    let processed = 0;
    let added = 0;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      // Get data as array of arrays
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      
      console.log(`\nProcessing Sheet: ${sheetName}...`);

      // Try to see if sheet name or first row/header is a district
      let sheetDefaultDistrict = null;
      if (districtNames.includes(sheetName.toLowerCase())) {
        sheetDefaultDistrict = districts.find(d => d.name.toLowerCase() === sheetName.toLowerCase()).name;
      }

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          const cityStr = cell?.toString().trim();
          if (!cityStr || cityStr === 'Town/City' || cityStr === 'S/No.' || !isNaN(cityStr)) continue;

          // If this is the header (i=0) and it's a district, we can use it as default for the column
          // (But for now, let's just process every cell as a city)

          const citySlug = slugify(cityStr);

          let finalDistrictName = sheetDefaultDistrict;

          // 1. Check if city name ITSELF is a district
          const cityAsDistrict = districts.find(d => d.name.toLowerCase() === cityStr.toLowerCase());
          if (cityAsDistrict) {
            finalDistrictName = cityAsDistrict.name;
          }

          if (!finalDistrictName) {
            // 2. Try mapping JSON
            let entry = mappingData.find(m => m.city.toLowerCase() === cityStr.toLowerCase() && m.state.toLowerCase() === 'punjab');
            if (entry) {
              finalDistrictName = entry.district;
            }
          }

          if (!finalDistrictName) {
            // 3. Try Nominatim Fallback
            console.log(`🔍 Fetching district for ${cityStr} via Nominatim...`);
            const rawDistrict = await getDistrictFromNominatim(cityStr);
            if (rawDistrict) {
              // Clean up the name (remove "District", "Tahsil", etc.)
              finalDistrictName = rawDistrict.replace(/District|Tahsil|Division/gi, '').trim();
            }
            await sleep(1000); 
          }

          if (finalDistrictName) {
            console.log(`📍 ${cityStr} -> District: ${finalDistrictName}`);
            
            // Ensure District exists
            const [district] = await District.findOrCreate({
              where: { state_id: punjabState.id, name: finalDistrictName },
              defaults: { name: finalDistrictName, state_id: punjabState.id }
            });

            // Ensure Location
            const [location, created] = await Location.findOrCreate({
              where: { slug: citySlug },
              defaults: {
                name: cityStr,
                slug: citySlug,
                state_id: punjabState.id,
                district_id: district.id
              }
            });

            if (created) added++;
            else {
              if (location.district_id !== district.id) {
                await location.update({ district_id: district.id });
              }
            }
            processed++;
          } else {
            console.log(`⚠️ Could not determine district for: ${cityStr}`);
          }
        }
      }
    }

    console.log(`\n✅ Done! Processed ${processed} cities.`);
    console.log(`Added ${added} new locations.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

importCities();
