/**
 * Markdown to HTML and HTML to Markdown converter utility
 * Uses markdown-it for MD→HTML and turndown for HTML→MD
 * Supports GitHub Flavored Markdown (GFM)
 */

import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

// Configure markdown-it for GFM support
const md = new MarkdownIt({
  html: true,           // Enable HTML tags in source
  linkify: true,        // Auto-convert URL-like text to links
  typographer: true,    // Enable smartquotes and other typographic replacements
  breaks: true,         // Convert \n in paragraphs into <br>
});

// Configure turndown for HTML to Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',           // Use # for headings
  hr: '---',                     // Horizontal rules
  bulletListMarker: '-',         // List markers
  codeBlockStyle: 'fenced',      // Use ``` for code blocks
  fence: '```',                  // Code fence character
  emDelimiter: '*',              // Emphasis delimiter
  strongDelimiter: '**',         // Strong delimiter
  linkStyle: 'inlined',          // Inline links [text](url)
  linkReferenceStyle: 'full',    // Full reference style
});

// Add GFM strikethrough support to turndown
turndownService.addRule('strikethrough', {
  filter: ['del', 's'] as const,
  replacement: function (content) {
    return '~~' + content + '~~';
  }
});

// Add task list support
turndownService.addRule('taskListItem', {
  filter: function (node) {
    return (
      node.nodeName === 'LI' &&
      node.parentNode &&
      (node.parentNode as HTMLElement).classList?.contains('task-list') ||
      (node.querySelector('input[type="checkbox"]') !== null)
    );
  },
  replacement: function (content, node) {
    const checkbox = (node as HTMLElement).querySelector('input[type="checkbox"]');
    const checked = checkbox?.hasAttribute('checked') ?? false;
    const cleanContent = content.replace(/^\s*\[[ x]\]\s*/i, '').trim();
    return (checked ? '- [x] ' : '- [ ] ') + cleanContent + '\n';
  }
});

// Add table support
turndownService.addRule('table', {
  filter: 'table',
  replacement: function (_content, node) {
    const table = node as HTMLTableElement;
    const rows: string[][] = [];

    // Get all rows
    const tableRows = table.querySelectorAll('tr');
    tableRows.forEach((row) => {
      const cells: string[] = [];
      row.querySelectorAll('th, td').forEach((cell) => {
        cells.push(cell.textContent?.trim() || '');
      });
      if (cells.length > 0) {
        rows.push(cells);
      }
    });

    if (rows.length === 0) return '';

    // Build markdown table
    let result = '';

    // Header row
    result += '| ' + rows[0].join(' | ') + ' |\n';

    // Separator row
    result += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';

    // Data rows
    for (let i = 1; i < rows.length; i++) {
      result += '| ' + rows[i].join(' | ') + ' |\n';
    }

    return '\n' + result + '\n';
  }
});

/**
 * Convert Markdown to HTML
 * Supports GitHub Flavored Markdown features
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) {
    return '';
  }

  try {
    // Pre-process GFM features that markdown-it doesn't handle natively
    let processed = markdown;

    // Handle strikethrough ~~text~~
    processed = processed.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Handle task lists
    processed = processed.replace(
      /^(\s*)-\s*\[([ xX])\]\s+(.*)$/gm,
      (_match, indent, checked, text) => {
        const isChecked = checked.toLowerCase() === 'x';
        return `${indent}<li class="task-list-item"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled> ${text}</li>`;
      }
    );

    // Convert task list items to proper list
    processed = processed.replace(
      /(<li class="task-list-item">.*<\/li>\n?)+/g,
      (match) => `<ul class="task-list">\n${match}</ul>\n`
    );

    // Render with markdown-it
    const html = md.render(processed);

    return html.trim();
  } catch (error) {
    throw new Error(`Failed to convert Markdown: ${(error as Error).message}`);
  }
}

/**
 * Convert HTML to Markdown
 * Supports tables, task lists, and strikethrough
 */
export function htmlToMarkdown(html: string): string {
  if (!html.trim()) {
    return '';
  }

  try {
    // Convert using turndown
    let markdown = turndownService.turndown(html);

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown.trim();
  } catch (error) {
    throw new Error(`Failed to convert HTML: ${(error as Error).message}`);
  }
}

/**
 * Validate HTML string (basic check)
 */
export function isValidHtml(html: string): boolean {
  if (!html.trim()) return false;

  // Check for basic HTML structure
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(html);
  return hasHtmlTags;
}

/**
 * Validate Markdown string (basic check)
 */
export function isValidMarkdown(markdown: string): boolean {
  // Markdown is essentially any text, so just check it's not empty
  return markdown.trim().length > 0;
}
