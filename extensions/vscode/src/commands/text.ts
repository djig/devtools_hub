import * as vscode from 'vscode';
import { processText } from '../utils/editor';

function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+|_|-/g, '');
}

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+|_|-/g, '');
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/\s+|-/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/\s+|_/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

function toUppercase(str: string): string {
  return str.toUpperCase();
}

function toLowercase(str: string): string {
  return str.toLowerCase();
}

export function registerTextCommands(context: vscode.ExtensionContext) {
  const commands = [
    { id: 'devtools-hub.toCamelCase', handler: () => processText(toCamelCase, 'Convert to camelCase') },
    { id: 'devtools-hub.toPascalCase', handler: () => processText(toPascalCase, 'Convert to PascalCase') },
    { id: 'devtools-hub.toSnakeCase', handler: () => processText(toSnakeCase, 'Convert to snake_case') },
    { id: 'devtools-hub.toKebabCase', handler: () => processText(toKebabCase, 'Convert to kebab-case') },
    { id: 'devtools-hub.toUppercase', handler: () => processText(toUppercase, 'Convert to UPPERCASE') },
    { id: 'devtools-hub.toLowercase', handler: () => processText(toLowercase, 'Convert to lowercase') },
  ];

  commands.forEach(({ id, handler }) => {
    const disposable = vscode.commands.registerCommand(id, handler);
    context.subscriptions.push(disposable);
  });
}
