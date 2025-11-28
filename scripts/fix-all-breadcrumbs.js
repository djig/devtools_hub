#!/usr/bin/env node

/**
 * Comprehensive script to move ALL breadcrumbs into headers
 */

import fs from 'fs';
import { glob } from 'glob';

const files = await glob('src/pages/tools/**/*.tsx', { ignore: '**/ComingSoon.tsx' });

let updatedCount = 0;
let skippedCount = 0;
let patterns = {
  oldCompactHeader: 0,
  oldRoundedHeader: 0,
  alreadyFixed: 0,
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let wasUpdated = false;

  // Skip if breadcrumb is already inside header
  if (content.includes('Breadcrumb Navigation') || content.includes('px-6 pt-4 pb-2">\n          <Breadcrumb />')) {
    console.log(`✓ Already updated: ${file}`);
    patterns.alreadyFixed++;
    skippedCount++;
    continue;
  }

  // Skip if no breadcrumb import
  if (!content.includes('Breadcrumb')) {
    console.log(`⏭️  No breadcrumb: ${file}`);
    skippedCount++;
    continue;
  }

  const originalContent = content;

  // Pattern 1: Breadcrumb before "Compact Hero Section" OR "Compact Header"
  // Remove standalone breadcrumb
  content = content.replace(
    /(<div className="space-y-6">\s*)<Breadcrumb \/>\s*\n\s*\n\s*({\/\* Compact (?:Hero Section|Header))/,
    '$1$2'
  );

  // Pattern 2: Old style rounded header (like IpInfo, CspGenerator)
  // Match: {/* Compact Header */} followed by rounded-lg border
  if (content.includes('rounded-lg border bg-gradient')) {
    const updated = content.replace(
      /({\/\* Compact Header \*\/}\s*<div className="relative overflow-hidden rounded-lg border bg-gradient-to-br [^>]+>\s*<div className="[^"]*">\s*)({\/\* Title Row \*\/})/,
      '$1{/* Breadcrumb Navigation */}\n          <div className="px-6 pt-4 pb-2">\n            <Breadcrumb />\n          </div>\n\n          $2'
    );

    if (updated !== content) {
      content = updated;
      // Also update the comment
      content = content.replace(
        /{\/\* Compact Header \*\/}/,
        '{/* Compact Header with Breadcrumb */}'
      );
      patterns.oldRoundedHeader++;
      wasUpdated = true;
    }
  }

  // Pattern 3: Standard "Compact Hero Section" with actions
  if (!wasUpdated && content.includes('Compact Hero Section')) {
    const updated = content.replace(
      /({\/\* Compact Hero Section[^*]*\*\/}\s*<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary\/10 via-primary\/5 to-background border border-primary\/20 shadow-sm">\s*<div className="absolute inset-0 bg-grid-white\/10 \[mask-image:radial-gradient\(white,transparent_85%\)\]" \/>\s*<div className="relative">\s*)(<div className="flex items-center)/,
      '$1{/* Breadcrumb Navigation */}\n        <div className="px-6 pt-4 pb-2">\n          <Breadcrumb />\n        </div>\n\n        $2'
    );

    if (updated !== content) {
      content = updated;

      // Update padding from p-6 to px-6 pb-6
      content = content.replace(
        /({\/\* Breadcrumb Navigation[\s\S]{0,200}?<div className="flex items-center[^>]*?)p-6(")/,
        '$1px-6 pb-6$2'
      );

      // Update comment
      content = content.replace(
        /{\/\* Compact Hero Section \*\/}/,
        '{/* Compact Hero Section with Breadcrumb */}'
      );
      content = content.replace(
        /{\/\* Compact Hero Section with Actions \*\/}/,
        '{/* Compact Hero Section with Breadcrumb & Actions */}'
      );

      patterns.oldCompactHeader++;
      wasUpdated = true;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`✅ Updated: ${file}`);
    updatedCount++;
  } else if (content.includes('<Breadcrumb />')) {
    console.log(`⚠️  Needs manual review: ${file}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`✅ Updated: ${updatedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`\nPattern breakdown:`);
console.log(`  - Already fixed: ${patterns.alreadyFixed}`);
console.log(`  - Old rounded headers: ${patterns.oldRoundedHeader}`);
console.log(`  - Old compact headers: ${patterns.oldCompactHeader}`);
