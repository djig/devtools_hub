import * as vscode from 'vscode';
import { processText } from '../utils/editor';

function encodeBase64(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64');
}

function decodeBase64(input: string): string {
  return Buffer.from(input, 'base64').toString('utf-8');
}

function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

function decodeUrl(text: string): string {
  return decodeURIComponent(text);
}

export function registerEncoderCommands(context: vscode.ExtensionContext) {
  const commands = [
    { id: 'devtools-hub.encodeBase64', handler: () => processText(encodeBase64, 'Encode Base64') },
    { id: 'devtools-hub.decodeBase64', handler: () => processText(decodeBase64, 'Decode Base64') },
    { id: 'devtools-hub.encodeUrl', handler: () => processText(encodeUrl, 'URL Encode') },
    { id: 'devtools-hub.decodeUrl', handler: () => processText(decodeUrl, 'URL Decode') },
  ];

  commands.forEach(({ id, handler }) => {
    const disposable = vscode.commands.registerCommand(id, handler);
    context.subscriptions.push(disposable);
  });
}
