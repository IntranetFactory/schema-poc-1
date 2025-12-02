import { compile } from 'json-schema-to-typescript';
import * as fs from 'fs';
import * as path from 'path';

const SCHEMAS_DIR = path.join(__dirname, '../src/schemas');
const OUTPUT_DIR = path.join(__dirname, '../src/generated');

async function generateTypes() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all schema files
  const schemaFiles = fs.readdirSync(SCHEMAS_DIR)
    .filter(file => file.endsWith('.schema.json'));

  console.log(`Found ${schemaFiles.length} schema files:`);
  schemaFiles.forEach(file => console.log(`  - ${file}`));

  // Generate TypeScript types for each schema
  for (const schemaFile of schemaFiles) {
    const schemaPath = path.join(SCHEMAS_DIR, schemaFile);
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);

    console.log(`\nGenerating types for ${schemaFile}...`);

    try {
      const ts = await compile(schema, schema.title || 'Schema', {
        bannerComment: '',
        style: {
          semi: true,
          singleQuote: true
        }
      });

      const outputFileName = schemaFile.replace('.schema.json', '.d.ts');
      const outputPath = path.join(OUTPUT_DIR, outputFileName);
      
      fs.writeFileSync(outputPath, ts);
      console.log(`✓ Generated ${outputFileName}`);
    } catch (error) {
      console.error(`✗ Error generating types for ${schemaFile}:`, error);
      throw error;
    }
  }

  console.log('\n✓ All types generated successfully!');
}

generateTypes().catch(error => {
  console.error('Failed to generate types:', error);
  process.exit(1);
});
