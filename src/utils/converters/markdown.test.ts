import { describe, it, expect } from 'vitest';
import { markdownToHtml, htmlToMarkdown, isValidHtml, isValidMarkdown } from './markdown';

describe('markdown converter', () => {
  describe('markdownToHtml', () => {
    describe('basic elements', () => {
      it('converts headers', () => {
        expect(markdownToHtml('# Heading 1')).toContain('<h1>Heading 1</h1>');
        expect(markdownToHtml('## Heading 2')).toContain('<h2>Heading 2</h2>');
        expect(markdownToHtml('### Heading 3')).toContain('<h3>Heading 3</h3>');
      });

      it('converts paragraphs', () => {
        const result = markdownToHtml('This is a paragraph.');
        expect(result).toContain('<p>');
        expect(result).toContain('This is a paragraph.');
      });

      it('converts bold text', () => {
        expect(markdownToHtml('**bold text**')).toContain('<strong>bold text</strong>');
      });

      it('converts italic text', () => {
        expect(markdownToHtml('*italic text*')).toContain('<em>italic text</em>');
      });

      it('converts links', () => {
        const result = markdownToHtml('[link](https://example.com)');
        expect(result).toContain('<a href="https://example.com">link</a>');
      });

      it('converts images', () => {
        const result = markdownToHtml('![alt text](image.png)');
        expect(result).toContain('<img');
        expect(result).toContain('src="image.png"');
        expect(result).toContain('alt="alt text"');
      });

      it('converts unordered lists', () => {
        const md = '- Item 1\n- Item 2\n- Item 3';
        const result = markdownToHtml(md);
        expect(result).toContain('<ul>');
        expect(result).toContain('<li>Item 1</li>');
        expect(result).toContain('<li>Item 2</li>');
        expect(result).toContain('<li>Item 3</li>');
      });

      it('converts ordered lists', () => {
        const md = '1. Item 1\n2. Item 2\n3. Item 3';
        const result = markdownToHtml(md);
        expect(result).toContain('<ol>');
        expect(result).toContain('<li>Item 1</li>');
      });

      it('converts blockquotes', () => {
        const result = markdownToHtml('> This is a quote');
        expect(result).toContain('<blockquote>');
        expect(result).toContain('This is a quote');
      });

      it('converts inline code', () => {
        const result = markdownToHtml('Use `code` here');
        expect(result).toContain('<code>code</code>');
      });

      it('converts code blocks', () => {
        const md = '```javascript\nconst x = 1;\n```';
        const result = markdownToHtml(md);
        expect(result).toContain('<pre>');
        expect(result).toContain('<code');
        expect(result).toContain('const x = 1;');
      });

      it('converts horizontal rules', () => {
        expect(markdownToHtml('---')).toContain('<hr');
      });
    });

    describe('GFM features', () => {
      it('converts strikethrough', () => {
        const result = markdownToHtml('~~strikethrough~~');
        expect(result).toContain('<del>strikethrough</del>');
      });

      it('converts task lists', () => {
        const md = '- [ ] Unchecked\n- [x] Checked';
        const result = markdownToHtml(md);
        expect(result).toContain('type="checkbox"');
        expect(result).toContain('checked');
      });

      it('auto-links URLs', () => {
        const result = markdownToHtml('Visit https://example.com');
        expect(result).toContain('<a href="https://example.com"');
      });
    });

    describe('edge cases', () => {
      it('returns empty string for empty input', () => {
        expect(markdownToHtml('')).toBe('');
        expect(markdownToHtml('   ')).toBe('');
      });

      it('handles complex nested content', () => {
        const md = '# Title\n\n**Bold** and *italic* with `code`\n\n- List item';
        const result = markdownToHtml(md);
        expect(result).toContain('<h1>');
        expect(result).toContain('<strong>');
        expect(result).toContain('<em>');
        expect(result).toContain('<code>');
        expect(result).toContain('<li>');
      });
    });
  });

  describe('htmlToMarkdown', () => {
    describe('basic elements', () => {
      it('converts headers', () => {
        expect(htmlToMarkdown('<h1>Heading 1</h1>')).toBe('# Heading 1');
        expect(htmlToMarkdown('<h2>Heading 2</h2>')).toBe('## Heading 2');
        expect(htmlToMarkdown('<h3>Heading 3</h3>')).toBe('### Heading 3');
      });

      it('converts paragraphs', () => {
        const result = htmlToMarkdown('<p>This is a paragraph.</p>');
        expect(result).toContain('This is a paragraph.');
      });

      it('converts bold text', () => {
        expect(htmlToMarkdown('<strong>bold</strong>')).toContain('**bold**');
        expect(htmlToMarkdown('<b>bold</b>')).toContain('**bold**');
      });

      it('converts italic text', () => {
        expect(htmlToMarkdown('<em>italic</em>')).toContain('*italic*');
        expect(htmlToMarkdown('<i>italic</i>')).toContain('*italic*');
      });

      it('converts links', () => {
        const result = htmlToMarkdown('<a href="https://example.com">link</a>');
        expect(result).toContain('[link](https://example.com)');
      });

      it('converts images', () => {
        const result = htmlToMarkdown('<img src="image.png" alt="alt text">');
        expect(result).toContain('![alt text](image.png)');
      });

      it('converts unordered lists', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        const result = htmlToMarkdown(html);
        expect(result).toMatch(/-\s+Item 1/);
        expect(result).toMatch(/-\s+Item 2/);
      });

      it('converts ordered lists', () => {
        const html = '<ol><li>Item 1</li><li>Item 2</li></ol>';
        const result = htmlToMarkdown(html);
        expect(result).toContain('1.');
        expect(result).toContain('Item 1');
      });

      it('converts blockquotes', () => {
        const result = htmlToMarkdown('<blockquote>Quote text</blockquote>');
        expect(result).toContain('> Quote text');
      });

      it('converts inline code', () => {
        const result = htmlToMarkdown('<code>code</code>');
        expect(result).toContain('`code`');
      });

      it('converts code blocks', () => {
        const html = '<pre><code>const x = 1;</code></pre>';
        const result = htmlToMarkdown(html);
        expect(result).toContain('```');
        expect(result).toContain('const x = 1;');
      });

      it('converts horizontal rules', () => {
        const result = htmlToMarkdown('<hr>');
        expect(result).toContain('---');
      });
    });

    describe('GFM features', () => {
      it('converts strikethrough', () => {
        expect(htmlToMarkdown('<del>deleted</del>')).toContain('~~deleted~~');
        expect(htmlToMarkdown('<s>strikethrough</s>')).toContain('~~strikethrough~~');
      });

      it('converts tables', () => {
        const html = `
          <table>
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
          </table>
        `;
        const result = htmlToMarkdown(html);
        expect(result).toContain('| Header 1 | Header 2 |');
        expect(result).toContain('| --- | --- |');
        expect(result).toContain('| Cell 1 | Cell 2 |');
      });
    });

    describe('edge cases', () => {
      it('returns empty string for empty input', () => {
        expect(htmlToMarkdown('')).toBe('');
        expect(htmlToMarkdown('   ')).toBe('');
      });

      it('handles plain text without tags', () => {
        const result = htmlToMarkdown('Plain text');
        expect(result).toBe('Plain text');
      });

      it('handles nested elements', () => {
        const html = '<p><strong>Bold</strong> and <em>italic</em></p>';
        const result = htmlToMarkdown(html);
        expect(result).toContain('**Bold**');
        expect(result).toContain('*italic*');
      });
    });
  });

  describe('validation functions', () => {
    describe('isValidHtml', () => {
      it('returns true for valid HTML', () => {
        expect(isValidHtml('<p>text</p>')).toBe(true);
        expect(isValidHtml('<div><span>nested</span></div>')).toBe(true);
      });

      it('returns false for empty input', () => {
        expect(isValidHtml('')).toBe(false);
        expect(isValidHtml('   ')).toBe(false);
      });

      it('returns false for plain text', () => {
        expect(isValidHtml('plain text')).toBe(false);
      });
    });

    describe('isValidMarkdown', () => {
      it('returns true for any non-empty text', () => {
        expect(isValidMarkdown('# Heading')).toBe(true);
        expect(isValidMarkdown('Plain text')).toBe(true);
        expect(isValidMarkdown('**bold**')).toBe(true);
      });

      it('returns false for empty input', () => {
        expect(isValidMarkdown('')).toBe(false);
        expect(isValidMarkdown('   ')).toBe(false);
      });
    });
  });

  describe('roundtrip conversions', () => {
    it('preserves basic formatting in roundtrip', () => {
      const originalMd = '# Heading\n\nParagraph with **bold** and *italic*.';
      const html = markdownToHtml(originalMd);
      const backToMd = htmlToMarkdown(html);

      expect(backToMd).toContain('# Heading');
      expect(backToMd).toContain('**bold**');
      expect(backToMd).toContain('*italic*');
    });

    it('preserves lists in roundtrip', () => {
      const originalMd = '- Item 1\n- Item 2\n- Item 3';
      const html = markdownToHtml(originalMd);
      const backToMd = htmlToMarkdown(html);

      expect(backToMd).toMatch(/-\s+Item 1/);
      expect(backToMd).toMatch(/-\s+Item 2/);
      expect(backToMd).toMatch(/-\s+Item 3/);
    });

    it('preserves links in roundtrip', () => {
      const originalMd = '[Example](https://example.com)';
      const html = markdownToHtml(originalMd);
      const backToMd = htmlToMarkdown(html);

      expect(backToMd).toContain('[Example](https://example.com)');
    });
  });
});
