const fs = require('fs');
const path = require('path');

// Files to skip (no breadcrumb by design or already migrated)
const SKIP_FILES = [
  'ComingSoon.tsx',
  'UnicodeConverter.tsx',
  'SqlFormatter.tsx',
  'JsonDiff.tsx',
  'CidrCalculator.tsx',
  'SslDecoder.tsx',
  'Base64Tool.tsx',
  'TextCounter.tsx',
  'LoremIpsum.tsx',
  'UrlEncoder.tsx',
  'HtmlEncoder.tsx',
  'NumberBaseConverter.tsx',
  'JwtDecoder.tsx',
];

function migrateFile(filePath) {
  const filename = path.basename(filePath);

  if (SKIP_FILES.includes(filename)) {
    console.log(`⏭️  Skipping ${filename} (already migrated or excluded)`);
    return 'skipped';
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already using ToolPageLayout
  if (content.includes('ToolPageLayout')) {
    console.log(`⏭️  Skipping ${filename} (already using ToolPageLayout)`);
    return 'skipped';
  }

  // Check if has breadcrumb (if not, skip)
  if (!content.includes('<Breadcrumb')) {
    console.log(`⏭️  Skipping ${filename} (no breadcrumb found)`);
    return 'skipped';
  }

  console.log(`🔄 Migrating ${filename}...`);

  try {
    // Step 1: Remove Breadcrumb and SEO imports
    const breadcrumbImportRegex = /import \{ Breadcrumb \} from ['"]\.\.\/\.\.\/\.\.\/components\/shared\/Breadcrumb['"];?\n?/g;
    const seoImportRegex = /import \{ SEO \} from ['"]\.\.\/\.\.\/\.\.\/utils\/seo['"];?\n?/g;

    content = content.replace(breadcrumbImportRegex, '');
    content = content.replace(seoImportRegex, '');

    // Add ToolPageLayout import after other component imports
    const cardImportMatch = content.match(/import \{ Card \} from ['"]\.\.\/\.\.\/\.\.\/components\/ui\/Card['"];/);
    if (cardImportMatch) {
      const cardImportIndex = content.indexOf(cardImportMatch[0]) + cardImportMatch[0].length;
      content = content.slice(0, cardImportIndex) +
        "\nimport { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';" +
        content.slice(cardImportIndex);
    }

    // Step 2: Extract SEO props (handle multiline)
    const seoRegex = /<SEO\s+title="([^"]*)"\s+description="([^"]*)"\s+keywords="([^"]*)"\s+path="([^"]*)"\s*\/>/s;
    const seoMatch = content.match(seoRegex);

    if (!seoMatch) {
      console.log(`❌ Could not find SEO component in ${filename}`);
      return 'failed';
    }

    const [, seoTitle, seoDesc, seoKeywords, seoPath] = seoMatch;

    // Step 3: Extract icon, title, description from header
    const iconMatch = content.match(/<([A-Z][a-zA-Z0-9]*) className="h-5 w-5 text-primary"/);
    const titleMatch = content.match(/<h1[^>]*>\s*([^<]+)\s*<\/h1>/);
    const descMatch = content.match(/<p className="text-sm text-muted-foreground[^"]*"[^>]*>\s*([^<]+)\s*<\/p>/);

    if (!iconMatch || !titleMatch) {
      console.log(`❌ Could not extract header info from ${filename}`);
      return 'failed';
    }

    const icon = iconMatch[1];
    const title = titleMatch[1].trim();
    const description = descMatch ? descMatch[1].trim() : '';

    // Step 4: Check if there are action buttons
    const hasActions = content.includes('Action Buttons (TOP-RIGHT)');
    let actionsJSX = '';

    if (hasActions) {
      // Extract everything between the action buttons comment and the closing div
      const actionsRegex = /\{\/\* Action Buttons \(TOP-RIGHT\) \*\/\}\s*<div className="flex flex-wrap items-center justify-end gap-[^"]*">([\s\S]*?)<\/div>\s*<\/div>/;
      const actionsMatch = content.match(actionsRegex);

      if (actionsMatch) {
        actionsJSX = actionsMatch[1].trim();
      }
    }

    // Step 5: Find where the header ends and content begins
    // Look for the closing tags of the header gradient card
    const headerEndRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\n\s*\n/;
    const headerEndMatch = content.match(headerEndRegex);

    if (!headerEndMatch) {
      console.log(`❌ Could not find header end in ${filename}`);
      return 'failed';
    }

    const headerEndIndex = content.indexOf(headerEndMatch[0]) + headerEndMatch[0].length;

    // Extract everything from after header to before the final closing tags
    const footerRegex = /\s*<\/div>\s*<\/>\s*\);?\s*$/;
    const contentAfterHeader = content.slice(headerEndIndex);
    const toolContent = contentAfterHeader.replace(footerRegex, '').trim();

    // Step 6: Build new return statement with ToolPageLayout
    let newReturn = `  return (
    <ToolPageLayout
      seo={{
        title: "${seoTitle}",
        description: "${seoDesc}",
        keywords: "${seoKeywords}",
        path: "${seoPath}"
      }}
      icon={${icon}}
      title="${title}"
      description="${description}"`;

    if (actionsJSX) {
      newReturn += `\n      actions={\n        <>\n          ${actionsJSX}\n        </>\n      }`;
    }

    newReturn += `\n    >\n      ${toolContent}\n    </ToolPageLayout>\n  );\n}`;

    // Step 7: Replace old return statement
    const oldReturnRegex = /return \(\s*<>[\s\S]*?<\/>\s*\);?\s*\}/;
    content = content.replace(oldReturnRegex, newReturn);

    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully migrated ${filename}`);
    return 'success';

  } catch (error) {
    console.log(`❌ Error migrating ${filename}: ${error.message}`);
    return 'failed';
  }
}

// Find all tool files recursively
function findToolFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findToolFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') && file !== 'ComingSoon.tsx') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main execution
const toolsDir = path.join(__dirname, '../src/pages/tools');
const toolFiles = findToolFiles(toolsDir);

let successCount = 0;
let skippedCount = 0;
let failedCount = 0;

console.log(`\nFound ${toolFiles.length} tool files\n`);

toolFiles.forEach(file => {
  const result = migrateFile(file);
  if (result === 'success') {
    successCount++;
  } else if (result === 'skipped') {
    skippedCount++;
  } else if (result === 'failed') {
    failedCount++;
  }
});

console.log(`\n✨ Migration complete!`);
console.log(`   ✅ Migrated: ${successCount} files`);
console.log(`   ⏭️  Skipped: ${skippedCount} files`);
console.log(`   ❌ Failed: ${failedCount} files\n`);
