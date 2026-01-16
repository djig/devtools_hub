import * as vscode from 'vscode';

interface QuickPickItem extends vscode.QuickPickItem {
  command: string;
}

const TOOLS: QuickPickItem[] = [
  // Formatters
  { label: '$(json) Format JSON', description: 'Format JSON with indentation', command: 'devtools-hub.formatJson' },
  { label: '$(json) Minify JSON', description: 'Minify JSON (remove whitespace)', command: 'devtools-hub.minifyJson' },
  { label: '$(code) Format YAML', description: 'Format YAML', command: 'devtools-hub.formatYaml' },
  { label: '$(code) Format XML', description: 'Format XML', command: 'devtools-hub.formatXml' },
  { label: '$(symbol-method) Format JavaScript', description: 'Format JavaScript code', command: 'devtools-hub.formatJavaScript' },
  { label: '$(symbol-color) Format CSS', description: 'Format CSS', command: 'devtools-hub.formatCss' },
  { label: '$(browser) Format HTML', description: 'Format HTML', command: 'devtools-hub.formatHtml' },

  // Converters
  { label: '$(arrow-swap) JSON → YAML', description: 'Convert JSON to YAML', command: 'devtools-hub.jsonToYaml' },
  { label: '$(arrow-swap) YAML → JSON', description: 'Convert YAML to JSON', command: 'devtools-hub.yamlToJson' },
  { label: '$(arrow-swap) JSON → XML', description: 'Convert JSON to XML', command: 'devtools-hub.jsonToXml' },
  { label: '$(arrow-swap) XML → JSON', description: 'Convert XML to JSON', command: 'devtools-hub.xmlToJson' },
  { label: '$(arrow-swap) JSON → CSV', description: 'Convert JSON to CSV', command: 'devtools-hub.jsonToCsv' },
  { label: '$(arrow-swap) CSV → JSON', description: 'Convert CSV to JSON', command: 'devtools-hub.csvToJson' },
  { label: '$(symbol-interface) JSON → TypeScript', description: 'Generate TypeScript types from JSON', command: 'devtools-hub.jsonToTypeScript' },
  { label: '$(markdown) Markdown → HTML', description: 'Convert Markdown to HTML', command: 'devtools-hub.markdownToHtml' },
  { label: '$(code) HTML → Markdown', description: 'Convert HTML to Markdown', command: 'devtools-hub.htmlToMarkdown' },

  // Encoders
  { label: '$(lock) Encode Base64', description: 'Encode text to Base64', command: 'devtools-hub.encodeBase64' },
  { label: '$(unlock) Decode Base64', description: 'Decode Base64 to text', command: 'devtools-hub.decodeBase64' },
  { label: '$(link) URL Encode', description: 'URL encode text', command: 'devtools-hub.encodeUrl' },
  { label: '$(link-external) URL Decode', description: 'URL decode text', command: 'devtools-hub.decodeUrl' },

  // Generators
  { label: '$(key) Generate UUID', description: 'Generate a new UUID v4', command: 'devtools-hub.generateUuid' },
  { label: '$(shield) Generate MD5 Hash', description: 'Generate MD5 hash of text', command: 'devtools-hub.generateMd5' },
  { label: '$(shield) Generate SHA-256 Hash', description: 'Generate SHA-256 hash of text', command: 'devtools-hub.generateSha256' },

  // Text
  { label: '$(text-size) To camelCase', description: 'Convert to camelCase', command: 'devtools-hub.toCamelCase' },
  { label: '$(text-size) To PascalCase', description: 'Convert to PascalCase', command: 'devtools-hub.toPascalCase' },
  { label: '$(text-size) To snake_case', description: 'Convert to snake_case', command: 'devtools-hub.toSnakeCase' },
  { label: '$(text-size) To kebab-case', description: 'Convert to kebab-case', command: 'devtools-hub.toKebabCase' },
  { label: '$(text-size) To UPPERCASE', description: 'Convert to UPPERCASE', command: 'devtools-hub.toUppercase' },
  { label: '$(text-size) To lowercase', description: 'Convert to lowercase', command: 'devtools-hub.toLowercase' },
];

export function createStatusBarItem(): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = '$(tools) DevTools';
  statusBarItem.tooltip = 'DevTools Hub - Click to show all tools';
  statusBarItem.command = 'devtools-hub.showQuickPick';

  return statusBarItem;
}

export async function showQuickPick(): Promise<void> {
  const selected = await vscode.window.showQuickPick(TOOLS, {
    placeHolder: 'Select a DevTools Hub tool',
    matchOnDescription: true,
  });

  if (selected) {
    await vscode.commands.executeCommand(selected.command);
  }
}
