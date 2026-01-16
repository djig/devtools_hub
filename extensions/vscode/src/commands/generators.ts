import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { getSelectedText, insertText, replaceSelectedText, showInfo, showError } from '../utils/editor';

function generateMD5(text: string): string {
  return CryptoJS.MD5(text).toString();
}

function generateSHA256(text: string): string {
  return CryptoJS.SHA256(text).toString();
}

export function registerGeneratorCommands(context: vscode.ExtensionContext) {
  // UUID Generator - inserts at cursor
  const uuidCommand = vscode.commands.registerCommand('devtools-hub.generateUuid', async () => {
    const uuid = uuidv4();
    const success = await insertText(uuid);
    if (success) {
      showInfo(`Generated UUID: ${uuid}`);
    } else {
      // Copy to clipboard as fallback
      await vscode.env.clipboard.writeText(uuid);
      showInfo(`UUID copied to clipboard: ${uuid}`);
    }
  });

  // MD5 Generator - hashes selected text
  const md5Command = vscode.commands.registerCommand('devtools-hub.generateMd5', async () => {
    const text = getSelectedText();
    if (!text) {
      showError('No text selected to hash');
      return;
    }
    try {
      const hash = generateMD5(text);
      const success = await replaceSelectedText(hash);
      if (success) {
        showInfo('MD5 hash generated');
      }
    } catch (error) {
      showError(`MD5 generation failed: ${(error as Error).message}`);
    }
  });

  // SHA-256 Generator - hashes selected text
  const sha256Command = vscode.commands.registerCommand('devtools-hub.generateSha256', async () => {
    const text = getSelectedText();
    if (!text) {
      showError('No text selected to hash');
      return;
    }
    try {
      const hash = generateSHA256(text);
      const success = await replaceSelectedText(hash);
      if (success) {
        showInfo('SHA-256 hash generated');
      }
    } catch (error) {
      showError(`SHA-256 generation failed: ${(error as Error).message}`);
    }
  });

  context.subscriptions.push(uuidCommand, md5Command, sha256Command);
}
