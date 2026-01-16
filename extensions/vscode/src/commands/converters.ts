import * as vscode from 'vscode';
import { processText } from '../utils/editor';

// Import conversion functions
import * as yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import Papa from 'papaparse';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

// JSON <-> YAML
function jsonToYaml(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  return yaml.dump(parsed, { indent: 2 });
}

function yamlToJson(yamlString: string): string {
  const parsed = yaml.load(yamlString);
  return JSON.stringify(parsed, null, 2);
}

// JSON <-> XML
function jsonToXml(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false, suppressEmptyNode: true });
  return builder.build(parsed);
}

function xmlToJson(xmlString: string): string {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xmlString);
  return JSON.stringify(parsed, null, 2);
}

// JSON <-> CSV
function jsonToCsv(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  const array = Array.isArray(parsed) ? parsed : [parsed];
  return Papa.unparse(array);
}

function csvToJson(csvString: string): string {
  const result = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }
  return JSON.stringify(result.data, null, 2);
}

// JSON -> TypeScript (simplified version)
function jsonToTypeScript(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  return generateTypeScript(parsed, 'Root');
}

function generateTypeScript(value: unknown, name: string): string {
  if (value === null) return `export type ${name} = null;`;
  if (typeof value !== 'object') return `export type ${name} = ${typeof value};`;

  if (Array.isArray(value)) {
    if (value.length === 0) return `export type ${name} = unknown[];`;
    const itemType = typeof value[0] === 'object' ? `${name}Item` : typeof value[0];
    let result = '';
    if (typeof value[0] === 'object' && value[0] !== null) {
      result = generateTypeScript(value[0], `${name}Item`) + '\n\n';
    }
    return result + `export type ${name} = ${itemType}[];`;
  }

  const properties: string[] = [];
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
    let propType: string;
    if (val === null) {
      propType = 'null';
    } else if (typeof val === 'object') {
      propType = Array.isArray(val) ? 'unknown[]' : 'Record<string, unknown>';
    } else {
      propType = typeof val;
    }
    properties.push(`  ${safeKey}: ${propType};`);
  }

  return `export interface ${name} {\n${properties.join('\n')}\n}`;
}

// Markdown <-> HTML
const md = new MarkdownIt({ html: true, linkify: true });
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

function markdownToHtml(markdown: string): string {
  return md.render(markdown);
}

function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function registerConverterCommands(context: vscode.ExtensionContext) {
  const commands = [
    { id: 'devtools-hub.jsonToYaml', handler: () => processText(jsonToYaml, 'JSON → YAML') },
    { id: 'devtools-hub.yamlToJson', handler: () => processText(yamlToJson, 'YAML → JSON') },
    { id: 'devtools-hub.jsonToXml', handler: () => processText(jsonToXml, 'JSON → XML') },
    { id: 'devtools-hub.xmlToJson', handler: () => processText(xmlToJson, 'XML → JSON') },
    { id: 'devtools-hub.jsonToCsv', handler: () => processText(jsonToCsv, 'JSON → CSV') },
    { id: 'devtools-hub.csvToJson', handler: () => processText(csvToJson, 'CSV → JSON') },
    { id: 'devtools-hub.jsonToTypeScript', handler: () => processText(jsonToTypeScript, 'JSON → TypeScript') },
    { id: 'devtools-hub.markdownToHtml', handler: () => processText(markdownToHtml, 'Markdown → HTML') },
    { id: 'devtools-hub.htmlToMarkdown', handler: () => processText(htmlToMarkdown, 'HTML → Markdown') },
  ];

  commands.forEach(({ id, handler }) => {
    const disposable = vscode.commands.registerCommand(id, handler);
    context.subscriptions.push(disposable);
  });
}
