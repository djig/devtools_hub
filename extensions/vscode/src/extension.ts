import * as vscode from 'vscode';
import { registerFormatterCommands } from './commands/formatters';
import { registerConverterCommands } from './commands/converters';
import { registerEncoderCommands } from './commands/encoders';
import { registerGeneratorCommands } from './commands/generators';
import { registerTextCommands } from './commands/text';
import { createStatusBarItem, showQuickPick } from './providers/statusBar';

export function activate(context: vscode.ExtensionContext) {
  console.log('DevTools Hub extension is now active');

  // Register all command categories
  registerFormatterCommands(context);
  registerConverterCommands(context);
  registerEncoderCommands(context);
  registerGeneratorCommands(context);
  registerTextCommands(context);

  // Register quick pick command
  const quickPickCommand = vscode.commands.registerCommand(
    'devtools-hub.showQuickPick',
    showQuickPick
  );
  context.subscriptions.push(quickPickCommand);

  // Create status bar item
  const statusBarItem = createStatusBarItem();
  context.subscriptions.push(statusBarItem);

  // Show status bar based on config
  const config = vscode.workspace.getConfiguration('devtools-hub');
  if (config.get('showStatusBarItem', true)) {
    statusBarItem.show();
  }

  // Listen for config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('devtools-hub.showStatusBarItem')) {
        const showStatusBar = vscode.workspace
          .getConfiguration('devtools-hub')
          .get('showStatusBarItem', true);
        if (showStatusBar) {
          statusBarItem.show();
        } else {
          statusBarItem.hide();
        }
      }
    })
  );
}

export function deactivate() {
  console.log('DevTools Hub extension is now deactivated');
}
