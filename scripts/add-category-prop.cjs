const fs = require('fs');
const path = require('path');

// Map tool paths to their categories based on tools.ts
const toolsMap = {
  // Formatters
  '/tools/json-formatter': 'formatters',
  '/tools/json-diff': 'formatters',
  '/tools/xml-formatter': 'formatters',
  '/tools/yaml-formatter': 'formatters',
  '/tools/sql-formatter': 'formatters',
  '/tools/json-schema-validator': 'formatters',

  // Converters
  '/tools/json-yaml-converter': 'converters',
  '/tools/json-xml-converter': 'converters',
  '/tools/json-csv-converter': 'converters',
  '/tools/json-to-schema-converter': 'converters',

  // Encoders
  '/tools/base64-encoder': 'encoders',
  '/tools/url-encoder': 'encoders',
  '/tools/html-encoder': 'encoders',
  '/tools/jwt-decoder': 'encoders',
  '/tools/unicode-converter': 'encoders',
  '/tools/number-base-converter': 'encoders',

  // Text
  '/tools/text-diff': 'text',
  '/tools/markdown-editor': 'text',
  '/tools/regex-tester': 'text',
  '/tools/case-converter': 'text',
  '/tools/text-counter': 'text',
  '/tools/lorem-ipsum': 'text',
  '/tools/line-sorter': 'text',

  // Generators
  '/tools/uuid-generator': 'generators',
  '/tools/hash-generator': 'generators',
  '/tools/qr-code-generator': 'generators',
  '/tools/random-data-generator': 'generators',

  // DateTime
  '/tools/epoch-converter': 'datetime',
  '/tools/timezone-converter': 'datetime',
  '/tools/date-calculator': 'datetime',
  '/tools/duration-calculator': 'datetime',

  // Calculators
  '/tools/percentage-calculator': 'calculators',
  '/tools/unit-converter': 'calculators',
  '/tools/aspect-ratio-calculator': 'calculators',

  // Developer
  '/tools/color-converter': 'developer',
  '/tools/css-minifier': 'developer',
  '/tools/js-minifier': 'developer',
  '/tools/html-minifier': 'developer',
  '/tools/cron-parser': 'developer',
  '/tools/http-status-codes': 'developer',
  '/tools/user-agent-parser': 'developer',
  '/tools/image-base64-converter': 'developer',
  '/tools/meta-tag-generator': 'developer',

  // Network
  '/tools/ip-info': 'network',
  '/tools/cidr-calculator': 'network',
  '/tools/ssl-decoder': 'network',
  '/tools/csp-generator': 'network',
};

function processFile(filePath, toolPath, category) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if category prop already exists
    if (content.includes('category="') || content.includes("category='")) {
      console.log(`✓ ${filePath} - already has category`);
      return;
    }

    // Find ToolPageLayout component and add category prop
    const regex = /(<ToolPageLayout[\s\S]*?description="[^"]*")/;
    const match = content.match(regex);

    if (match) {
      const replacement = match[1] + `\n      category="${category}"`;
      content = content.replace(regex, replacement);

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filePath} - added category="${category}"`);
    } else {
      console.log(`✗ ${filePath} - ToolPageLayout not found or pattern mismatch`);
    }
  } catch (error) {
    console.error(`✗ ${filePath} - Error: ${error.message}`);
  }
}

// Process all tool files
const toolsDir = path.join(__dirname, '../src/pages/tools');

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      // Extract tool path from file
      const content = fs.readFileSync(filePath, 'utf8');
      const pathMatch = content.match(/path:\s*["']([^"']+)["']/);

      if (pathMatch) {
        const toolPath = pathMatch[1];
        const category = toolsMap[toolPath];

        if (category) {
          processFile(filePath, toolPath, category);
        } else {
          console.log(`? ${filePath} - No category mapping found for ${toolPath}`);
        }
      }
    }
  });
}

console.log('Adding category prop to all tool pages...\n');
walkDir(toolsDir);
console.log('\nDone!');
