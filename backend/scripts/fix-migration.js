const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixMigration() {
  await client.connect();
  
  try {
    // Verificar si la migración ya está registrada
    const checkResult = await client.query(
      'SELECT * FROM migrations WHERE name = $1',
      ['AddProgramaIdToUsuarios1743918420000']
    );
    
    if (checkResult.rows.length === 0) {
      // Insertar registro de migración
      await client.query(
        'INSERT INTO migrations (timestamp, name) VALUES ($1, $2)',
        [1743918420000, 'AddProgramaIdToUsuarios1743918420000']
      );
      console.log('✅ Migración registrada correctamente');
    } else {
      console.log('ℹ️ La migración ya estaba registrada');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

fixMigration();
