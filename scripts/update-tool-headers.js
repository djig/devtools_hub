#!/usr/bin/env node

/**
 * Batch update script to apply compact header design to all tool pages
 * This script updates the header sections to match the RandomDataGenerator design
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Pattern to match the current header structure
const OLD_HEADER_PATTERN = /(<div className="space-y-6">\s*<Breadcrumb \/>\s*<div>\s*<h1 className="text-3xl font-bold tracking-tight mb-2">)(.*?)(<\/h1>\s*<p className="text-muted-foreground">)(.*?)(<\/p>\s*<\/div>)/gs;

// New compact header template
function createCompactHeader(title, description, icon = null) {
  const iconComponent = icon || 'FileJson'; // Default icon

  return `<div className="space-y-6">
      <Breadcrumb />

      {/* Compact Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <${iconComponent} className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">${title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                ${description}
              </p>
            </div>
          </div>
        </div>
      </div>`;
}

// Icon mapping for different tool types
const ICON_MAP = {
  'JSON': 'FileJson',
  'Base64': 'Binary',
  'Encoder': 'Lock',
  'Decoder': 'Unlock',
  'URL': 'Link',
  'HTML': 'Code2',
  'CSS': 'Palette',
  'JavaScript': 'Code',
  'Minifier': 'Minimize2',
  'Formatter': 'AlignLeft',
  'Validator': 'CheckCircle',
  'Generator': 'Sparkles',
  'Calculator': 'Calculator',
  'Converter': 'RefreshCw',
  'Regex': 'Search',
  'Text': 'Type',
  'Case': 'CaseSensitive',
  'Color': 'Palette',
  'QR Code': 'QrCode',
  'UUID': 'Hash',
  'Hash': 'Shield',
  'Image': 'Image',
  'Time': 'Clock',
  'Date': 'Calendar',
  'Cron': 'Clock',
  'Network': 'Network',
  'IP': 'Globe',
  'SSL': 'Lock',
  'CSP': 'Shield',
  'User Agent': 'Monitor',
  'HTTP': 'Server',
  'Meta Tag': 'Tag',
  'Markdown': 'FileText',
  'Diff': 'GitCompare',
  'Lorem': 'Text',
  'Counter': 'Hash',
  'Sorter': 'ArrowUpDown',
  'YAML': 'FileCode',
  'XML': 'FileCode',
  'SQL': 'Database',
  'CSV': 'Table',
  'Schema': 'Box',
  'JWT': 'Key',
  'Duration': 'Timer',
  'Timezone': 'Globe',
  'Epoch': 'Clock',
  'CIDR': 'Network',
  'Unit': 'Ruler',
  'Aspect Ratio': 'LayoutGrid',
  'Percentage': 'Percent',
  'Number Base': 'Binary',
  'Unicode': 'Globe'
};

function getIconForTitle(title) {
  for (const [keyword, icon] of Object.entries(ICON_MAP)) {
    if (title.includes(keyword)) {
      return icon;
    }
  }
  return 'FileJson'; // Default
}

async function updateToolFiles() {
  const toolFiles = await glob('src/pages/tools/**/*.tsx', {
    ignore: ['**/ComingSoon.tsx', '**/RandomDataGenerator.tsx']
  });

  console.log(`Found ${toolFiles.length} tool files to update\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of toolFiles) {
    try {
      let content = fs.readFileSync(file, 'utf8');

      // Skip if already has the new format
      if (content.includes('Compact Hero Section') || content.includes('Hero Section with Integrated Controls')) {
        console.log(`⏭  Skipped (already updated): ${file}`);
        skipped++;
        continue;
      }

      // Skip ComingSoon components
      if (content.includes('ComingSoon')) {
        console.log(`⏭  Skipped (ComingSoon): ${file}`);
        skipped++;
        continue;
      }

      const match = content.match(OLD_HEADER_PATTERN);

      if (match) {
        const title = match[2].trim();
        const description = match[4].trim();
        const icon = getIconForTitle(title);

        // Make sure the icon is imported
        if (!content.includes(`import { ${icon}`) && !content.includes(`${icon},`)) {
          // Add icon to imports
          const lucideImportMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
          if (lucideImportMatch) {
            const existingIcons = lucideImportMatch[1];
            content = content.replace(
              /import\s*{[^}]+}\s*from\s*['"]lucide-react['"]/,
              `import { ${existingIcons}, ${icon} } from 'lucide-react'`
            );
          } else {
            // Add new lucide-react import
            const lastImportIndex = content.lastIndexOf('import');
            const nextLineIndex = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextLineIndex + 1) +
                     `import { ${icon} } from 'lucide-react';\n` +
                     content.slice(nextLineIndex + 1);
          }
        }

        // Replace the header
        const newHeader = createCompactHeader(title, description, icon);
        content = content.replace(OLD_HEADER_PATTERN, newHeader);

        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ Updated: ${file}`);
        updated++;
      } else {
        console.log(`⚠  No match found: ${file}`);
        skipped++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Summary:`);
  console.log(`  ✓ Updated: ${updated}`);
  console.log(`  ⏭  Skipped: ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
  console.log(`${'='.repeat(50)}\n`);
}

updateToolFiles().catch(console.error);
