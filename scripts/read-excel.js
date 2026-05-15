import xlsx from 'xlsx';

try {
  const workbook = xlsx.readFile('scripts/services.xlsx');
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(`Sheet "${sheetName}" has ${data.length} rows.`);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('First 3 rows:');
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
    }
  });
} catch (error) {
  console.error('Error reading excel:', error.message);
}
