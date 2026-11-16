import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PSIDatabaseSchema } from '../src/schemas/psi';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'src', 'data', 'psi_database.json');

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Database file does not exist at ${DB_PATH}. Run python scripts/ingest-psi.py first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const data = JSON.parse(raw);

  const parsed = PSIDatabaseSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Schema validation failed:', parsed.error.format());
    process.exit(1);
  }

  console.log('✅ Zod schema validation passed successfully!');
  console.log(`  - Validated ${parsed.data.totalInvestigations} investigations (${parsed.data.flightCount} flight, ${parsed.data.groundCount} ground)`);
  console.log(`  - Total runs: ${parsed.data.totalRuns}`);
}

main();
