import sequelize from '../src/lib/db.js';

async function main() {
  try {
    console.log('Checking indexes on locations table...');
    const [indexes] = await sequelize.query('SHOW INDEXES FROM locations');
    const hasUniqueNameIndex = indexes.some(idx => idx.Key_name === 'name' && idx.Non_unique === 0);

    if (hasUniqueNameIndex) {
      console.log('Dropping unique index on locations.name...');
      await sequelize.query('ALTER TABLE locations DROP INDEX name');
      console.log('Successfully dropped unique index on locations.name!');
    } else {
      console.log('No unique index on locations.name found.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to update constraints:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
