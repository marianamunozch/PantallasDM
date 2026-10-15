import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

import 'dotenv/config';

/**
 * Aplica schema.sql y seed.sql a la base configurada.
 *
 *   npm run db:setup        -> base de desarrollo (DATABASE_URL)
 *   npm run db:setup:test   -> base de tests (DATABASE_URL_TEST)
 *
 * No usa el pool de la aplicación a propósito: es una herramienta de
 * mantenimiento, abre su propia conexión y la cierra al terminar.
 */
const useTestDatabase = process.argv.includes('--test');
const connectionString = useTestDatabase
  ? process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL;

if (connectionString === undefined || connectionString.length === 0) {
  console.error(
    `Falta ${useTestDatabase ? 'DATABASE_URL_TEST' : 'DATABASE_URL'} en el .env`,
  );
  process.exit(1);
}

const dbDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'db');

async function run(): Promise<void> {
  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    for (const file of ['schema.sql', 'seed.sql']) {
      const sql = await readFile(join(dbDirectory, file), 'utf8');
      await client.query(sql);
      console.log(`  aplicado ${file}`);
    }
    console.log(`Base ${useTestDatabase ? 'de tests' : 'de desarrollo'} lista.`);
  } finally {
    await client.end();
  }
}

run().catch((error: unknown) => {
  console.error('Error preparando la base de datos:');
  console.error(error);
  process.exit(1);
});
