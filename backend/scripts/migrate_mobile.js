const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

async function runMigration() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  console.log(`[Migration] Reading database schema from: ${schemaPath}`);
  
  if (!fs.existsSync(schemaPath)) {
    console.error('[Migration] Error: schema.sql file not found.');
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Remove SQL comments (single-line -- and multi-line /* */)
  const cleanSql = sqlContent
    .replace(/--.*$/gm, '') 
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const sqlStatements = cleanSql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  console.log(`[Migration] Found ${sqlStatements.length} SQL queries to execute.`);
  
  const connection = await pool.getConnection();
  try {
    console.log('[Migration] Starting database migration transaction...');
    await connection.beginTransaction();

    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      // Print summary of query
      const snippet = sql.split('\n')[0].substring(0, 60);
      console.log(`[Migration] [${i + 1}/${sqlStatements.length}] Executing: "${snippet}..."`);
      
      await connection.query(sql);
    }

    await connection.commit();
    console.log('[Migration] SUCCESS! All new mobile logistics tables created on TiDB Cloud.');
  } catch (error) {
    console.error('[Migration] Migration failed! Rolling back changes...');
    await connection.rollback();
    console.error('[Migration] Database Error details:', error.message);
  } finally {
    connection.release();
    await pool.end();
    console.log('[Migration] Database connection pool closed.');
  }
}

runMigration();
