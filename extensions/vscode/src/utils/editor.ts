import * as vscode from 'vscode';

/**
 * Get selected text from the active editor
 * Returns the full document text if nothing is selected
 */
export function getSelectedText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }

  const selection = editor.selection;
  if (selection.isEmpty) {
    // Return full document if no selection
    return editor.document.getText();
  }

  return editor.document.getText(selection);
}

/**
 * Replace selected text (or full document if no selection) with new text
 */
export async function replaceSelectedText(newText: string): Promise<boolean> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }

  const selection = editor.selection;
  const range = selection.isEmpty
    ? new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      )
    : selection;

  return editor.edit((editBuilder) => {
    editBuilder.replace(range, newText);
  });
}

/**
 * Insert text at current cursor position
 */
export async function insertText(text: string): Promise<boolean> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }

  return editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, text);
  });
}

/**
 * Show an error message to the user
 */
export function showError(message: string): void {
  vscode.window.showErrorMessage(`DevTools Hub: ${message}`);
}

/**
 * Show an info message to the user
 */
export function showInfo(message: string): void {
  vscode.window.showInformationMessage(`DevTools Hub: ${message}`);
}

/**
 * Process text with a transformation function
 * Handles errors and displays appropriate messages
 */
export async function processText(
  transformFn: (text: string) => string,
  operationName: string
): Promise<void> {
  const text = getSelectedText();
  if (!text) {
    showError('No text to process. Open a file first.');
    return;
  }

  try {
    const result = transformFn(text);
    const success = await replaceSelectedText(result);
    if (success) {
      showInfo(`${operationName} completed`);
    } else {
      showError(`Failed to apply ${operationName}`);
    }
  } catch (error) {
    showError(`${operationName} failed: ${(error as Error).message}`);
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text);
  showInfo('Copied to clipboard');
}
