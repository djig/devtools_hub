/**
 * DevTools Hub Chrome Extension - Background Service Worker
 * Handles context menus and keyboard shortcuts
 */

import {
  formatJson,
  minifyJson,
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  generateUuidV4,
  generateMD5,
  generateSHA256,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toUppercase,
  toLowercase,
} from '@devtools-hub/core';

// Context menu item definitions
const MENU_ITEMS = [
  { id: 'separator-format', type: 'separator' as const },
  { id: 'format-json', title: 'Format JSON', parentId: 'devtools-hub' },
  { id: 'minify-json', title: 'Minify JSON', parentId: 'devtools-hub' },
  { id: 'separator-convert', type: 'separator' as const },
  { id: 'json-to-yaml', title: 'JSON → YAML', parentId: 'devtools-hub' },
  { id: 'yaml-to-json', title: 'YAML → JSON', parentId: 'devtools-hub' },
  { id: 'json-to-xml', title: 'JSON → XML', parentId: 'devtools-hub' },
  { id: 'xml-to-json', title: 'XML → JSON', parentId: 'devtools-hub' },
  { id: 'separator-encode', type: 'separator' as const },
  { id: 'encode-base64', title: 'Encode Base64', parentId: 'devtools-hub' },
  { id: 'decode-base64', title: 'Decode Base64', parentId: 'devtools-hub' },
  { id: 'encode-url', title: 'URL Encode', parentId: 'devtools-hub' },
  { id: 'decode-url', title: 'URL Decode', parentId: 'devtools-hub' },
  { id: 'separator-generate', type: 'separator' as const },
  { id: 'generate-uuid', title: 'Generate UUID', parentId: 'devtools-hub' },
  { id: 'generate-md5', title: 'Generate MD5 Hash', parentId: 'devtools-hub' },
  { id: 'generate-sha256', title: 'Generate SHA256 Hash', parentId: 'devtools-hub' },
  { id: 'separator-case', type: 'separator' as const },
  { id: 'to-camel-case', title: 'To camelCase', parentId: 'devtools-hub' },
  { id: 'to-pascal-case', title: 'To PascalCase', parentId: 'devtools-hub' },
  { id: 'to-snake-case', title: 'To snake_case', parentId: 'devtools-hub' },
  { id: 'to-kebab-case', title: 'To kebab-case', parentId: 'devtools-hub' },
  { id: 'to-uppercase', title: 'To UPPERCASE', parentId: 'devtools-hub' },
  { id: 'to-lowercase', title: 'To lowercase', parentId: 'devtools-hub' },
];

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu
  chrome.contextMenus.create({
    id: 'devtools-hub',
    title: 'DevTools Hub',
    contexts: ['selection'],
  });

  // Create child menus
  MENU_ITEMS.forEach((item) => {
    if (item.type === 'separator') {
      chrome.contextMenus.create({
        id: item.id,
        type: 'separator',
        parentId: 'devtools-hub',
        contexts: ['selection'],
      });
    } else {
      chrome.contextMenus.create({
        id: item.id,
        title: item.title,
        parentId: item.parentId,
        contexts: ['selection'],
      });
    }
  });
});

// Process text with the specified tool
function processText(toolId: string, text: string): { result?: string; error?: string } {
  try {
    let result: string;
    switch (toolId) {
      case 'format-json':
        result = formatJson(text);
        break;
      case 'minify-json':
        result = minifyJson(text);
        break;
      case 'json-to-yaml':
        result = jsonToYaml(text);
        break;
      case 'yaml-to-json':
        result = yamlToJson(text);
        break;
      case 'json-to-xml':
        result = jsonToXml(text);
        break;
      case 'xml-to-json':
        result = xmlToJson(text);
        break;
      case 'encode-base64':
        result = encodeBase64(text);
        break;
      case 'decode-base64':
        result = decodeBase64(text);
        break;
      case 'encode-url':
        result = encodeUrl(text);
        break;
      case 'decode-url':
        result = decodeUrl(text);
        break;
      case 'generate-uuid':
        result = generateUuidV4();
        break;
      case 'generate-md5':
        result = generateMD5(text);
        break;
      case 'generate-sha256':
        result = generateSHA256(text);
        break;
      case 'to-camel-case':
        result = toCamelCase(text);
        break;
      case 'to-pascal-case':
        result = toPascalCase(text);
        break;
      case 'to-snake-case':
        result = toSnakeCase(text);
        break;
      case 'to-kebab-case':
        result = toKebabCase(text);
        break;
      case 'to-uppercase':
        result = toUppercase(text);
        break;
      case 'to-lowercase':
        result = toLowercase(text);
        break;
      default:
        return { error: `Unknown tool: ${toolId}` };
    }
    return { result };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText || !tab?.id) return;

  const { result, error } = processText(info.menuItemId as string, info.selectionText);

  if (error) {
    // Send error notification to content script
    chrome.tabs.sendMessage(tab.id, {
      type: 'DEVTOOLS_HUB_ERROR',
      error,
    });
    return;
  }

  // Send result to content script
  chrome.tabs.sendMessage(tab.id, {
    type: 'DEVTOOLS_HUB_RESULT',
    result,
    toolId: info.menuItemId,
  });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  // Get selected text from content script
  chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' }, (response) => {
    if (chrome.runtime.lastError || !response?.text) {
      // If no selection, generate UUID for uuid command
      if (command === 'generate-uuid') {
        const result = generateUuidV4();
        chrome.tabs.sendMessage(tab.id!, {
          type: 'DEVTOOLS_HUB_RESULT',
          result,
          toolId: command,
        });
      }
      return;
    }

    const { result, error } = processText(command, response.text);

    if (error) {
      chrome.tabs.sendMessage(tab.id!, {
        type: 'DEVTOOLS_HUB_ERROR',
        error,
      });
      return;
    }

    chrome.tabs.sendMessage(tab.id!, {
      type: 'DEVTOOLS_HUB_RESULT',
      result,
      toolId: command,
    });
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PROCESS_TEXT') {
    const { result, error } = processText(message.toolId, message.text);
    sendResponse({ result, error });
  }
  return true;
});
