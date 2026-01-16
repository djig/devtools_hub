import * as vscode from 'vscode';
import { processText } from '../utils/editor';

// Import formatting functions directly (will be bundled by esbuild)
import { js as jsBeautify, css as cssBeautify, html as htmlBeautify } from 'js-beautify';
import * as yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

function formatJson(input: string, spaces: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, spaces);
}

function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

function formatYaml(yamlString: string): string {
  const parsed = yaml.load(yamlString);
  return yaml.dump(parsed, { indent: 2 });
}

function formatXml(xmlString: string): string {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xmlString);
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
  return builder.build(parsed);
}

function formatJavaScript(code: string): string {
  return jsBeautify(code, { indent_size: 2 });
}

function formatCSS(code: string): string {
  return cssBeautify(code, { indent_size: 2 });
}

function formatHTML(code: string): string {
  return htmlBeautify(code, { indent_size: 2, wrap_line_length: 80 });
}

export function registerFormatterCommands(context: vscode.ExtensionContext) {
  // Get JSON indent from config
  const config = vscode.workspace.getConfiguration('devtools-hub');
  const jsonIndent = config.get('jsonIndent', 2);

  const commands = [
    {
      id: 'devtools-hub.formatJson',
      handler: () => processText((text) => formatJson(text, jsonIndent), 'Format JSON'),
    },
    {
      id: 'devtools-hub.minifyJson',
      handler: () => processText(minifyJson, 'Minify JSON'),
    },
    {
      id: 'devtools-hub.formatYaml',
      handler: () => processText(formatYaml, 'Format YAML'),
    },
    {
      id: 'devtools-hub.formatXml',
      handler: () => processText(formatXml, 'Format XML'),
    },
    {
      id: 'devtools-hub.formatJavaScript',
      handler: () => processText(formatJavaScript, 'Format JavaScript'),
    },
    {
      id: 'devtools-hub.formatCss',
      handler: () => processText(formatCSS, 'Format CSS'),
    },
    {
      id: 'devtools-hub.formatHtml',
      handler: () => processText(formatHTML, 'Format HTML'),
    },
  ];

  commands.forEach(({ id, handler }) => {
    const disposable = vscode.commands.registerCommand(id, handler);
    context.subscriptions.push(disposable);
  });
}
