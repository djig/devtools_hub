#!/usr/bin/env node

/**
 * Script to move breadcrumb navigation inside the header for all tool pages
 */

import fs from 'fs';
import { glob } from 'glob';

// Find all tool files
const files = await glob('src/pages/tools/**/*.tsx', { ignore: '**/ComingSoon.tsx' });

let updatedCount = 0;
let skippedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if breadcrumb is already in header
  if (content.includes('Breadcrumb Navigation') || content.includes('Compact Hero Section with Breadcrumb')) {
    console.log(`✓ Skipped (already updated): ${file}`);
    skippedCount++;
    continue;
  }

  // Skip if no breadcrumb at all
  if (!content.includes('<Breadcrumb />')) {
    console.log(`⚠ Skipped (no breadcrumb): ${file}`);
    skippedCount++;
    continue;
  }

  // Pattern 1: Remove standalone breadcrumb before header
  // Match: <Breadcrumb />\n\n followed by header
  content = content.replace(
    /(\s*<div className="space-y-6">\s*)<Breadcrumb \/>\s*\n\s*\n\s*({\/\* Compact Hero Section)/,
    '$1$2'
  );

  // Pattern 2: For files with old "Compact Hero Section with Actions" (no breadcrumb inside yet)
  // Add breadcrumb section at the top of the header
  content = content.replace(
    /({\/\* Compact Hero Section with Actions \*\/}\s*<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary\/10 via-primary\/5 to-background border border-primary\/20 shadow-sm">\s*<div className="absolute inset-0 bg-grid-white\/10 \[mask-image:radial-gradient\(white,transparent_85%\)\]" \/>\s*<div className="relative">\s*)({\/\* Single Row: Title, Icon & Action Buttons \*\/})/,
    '$1{/* Breadcrumb Navigation */}\n        <div className="px-6 pt-4 pb-2">\n          <Breadcrumb />\n        </div>\n\n        $2'
  );

  // Pattern 3: Update comment from "Single Row" to reflect new structure
  content = content.replace(
    /{\/\* Single Row: Title, Icon & Action Buttons \*\/}/g,
    '{/* Single Row: Title, Icon & Action Buttons */}'
  );

  // Pattern 4: Update padding on title row from p-6 to px-6 pb-6 (if breadcrumb was added)
  if (content.includes('Breadcrumb Navigation')) {
    content = content.replace(
      /({\/\* Single Row: Title, Icon & Action Buttons \*\/}\s*<div className="flex items-center justify-between gap-4 )p-6(")/g,
      '$1px-6 pb-6$2'
    );
  }

  // Pattern 5: Update header comment to include "Breadcrumb"
  content = content.replace(
    /{\/\* Compact Hero Section with Actions \*\/}/,
    '{/* Compact Hero Section with Breadcrumb & Actions */}'
  );

  // Pattern 6: For simpler headers without actions (like TextCounter)
  // Match: standalone breadcrumb followed by header with just title
  content = content.replace(
    /(<div className="space-y-6">\s*)<Breadcrumb \/>\s*\n\s*\n\s*({\/\* Compact Hero Section \*\/}\s*<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary\/10 via-primary\/5 to-background border border-primary\/20 shadow-sm">\s*<div className="absolute inset-0 bg-grid-white\/10 \[mask-image:radial-gradient\(white,transparent_85%\)\]" \/>\s*<div className="relative">\s*)(<div className="flex items-center gap-4 p-6">)/,
    '$1$2{/* Breadcrumb Navigation */}\n        <div className="px-6 pt-4 pb-2">\n          <Breadcrumb />\n        </div>\n\n        $3'
  );

  // Update padding for simple headers too
  content = content.replace(
    /({\/\* Breadcrumb Navigation \*\/}[\s\S]*?{\/\* Compact Hero Section \*\/}[\s\S]*?<div className="flex items-center gap-4 )p-6(">)/g,
    '$1px-6 pb-6$2'
  );

  fs.writeFileSync(file, content);
  console.log(`✓ Updated: ${file}`);
  updatedCount++;
}

console.log(`\n✅ Updated ${updatedCount} files`);
console.log(`⏭️  Skipped ${skippedCount} files`);
