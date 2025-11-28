#!/usr/bin/env node

/**
 * Fix simple headers (no actions) that weren't properly updated
 */

import fs from 'fs';

const files = [
  'src/pages/tools/developer/ColorConverter.tsx',
  'src/pages/tools/developer/CronParser.tsx',
  'src/pages/tools/developer/HttpStatusCodes.tsx',
  'src/pages/tools/developer/ImageBase64Converter.tsx',
  'src/pages/tools/generators/QrCodeGenerator.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if Breadcrumb is imported but not used
  if (!content.includes('import') || !content.includes('Breadcrumb')) {
    console.log(`⏭️  Skipped: ${file} (no breadcrumb import)`);
    continue;
  }

  // Check if already has breadcrumb in header
  if (content.includes('Breadcrumb Navigation') || content.includes('<Breadcrumb />')) {
    console.log(`⏭️  Skipped: ${file} (already has breadcrumb)`);
    continue;
  }

  // Pattern: Add breadcrumb section at top of simple headers
  const updated = content.replace(
    /({\/\* Compact Hero Section \*\/}\s*<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary\/10 via-primary\/5 to-background border border-primary\/20 shadow-sm">\s*<div className="absolute inset-0 bg-grid-white\/10 \[mask-image:radial-gradient\(white,transparent_85%\)\]" \/>\s*<div className="relative">\s*)(<div className="flex items-center gap-4 )p-6(">)/,
    '$1{/* Breadcrumb Navigation */}\n        <div className="px-6 pt-4 pb-2">\n          <Breadcrumb />\n        </div>\n\n        $2px-6 pb-6$3'
  );

  // Update comment
  const final = updated.replace(
    /{\/\* Compact Hero Section \*\/}/,
    '{/* Compact Hero Section with Breadcrumb */}'
  );

  if (final !== content) {
    fs.writeFileSync(file, final);
    console.log(`✓ Updated: ${file}`);
  } else {
    console.log(`⚠ No changes: ${file}`);
  }
}
