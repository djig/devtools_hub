import { describe, it, expect } from 'vitest';
import { diffText } from './diff';

describe('diff', () => {
  describe('diffText', () => {
    it('detects no changes for identical text', () => {
      const result = diffText('hello\nworld', 'hello\nworld');
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(0);
      expect(result.stats.unchanged).toBe(2);
    });

    it('detects added lines', () => {
      const result = diffText('hello', 'hello\nworld');
      expect(result.stats.added).toBe(1);
      expect(result.lines.some((l) => l.type === 'added' && l.content === 'world')).toBe(true);
    });

    it('detects removed lines', () => {
      const result = diffText('hello\nworld', 'hello');
      expect(result.stats.removed).toBe(1);
      expect(result.lines.some((l) => l.type === 'removed' && l.content === 'world')).toBe(true);
    });

    it('detects changed lines', () => {
      const result = diffText('hello\nworld', 'hello\nearth');
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(1);
    });

    it('handles empty first text', () => {
      const result = diffText('', 'hello\nworld');
      // Empty string splits to [''], so we have 1 removed + 2 added
      expect(result.stats.added).toBeGreaterThanOrEqual(2);
    });

    it('handles empty second text', () => {
      const result = diffText('hello\nworld', '');
      // Empty string splits to [''], so we have 2 removed + 1 added
      expect(result.stats.removed).toBeGreaterThanOrEqual(2);
    });

    it('handles both empty texts', () => {
      const result = diffText('', '');
      expect(result.lines).toHaveLength(1); // Empty string splits to ['']
    });

    it('includes line numbers for unchanged lines', () => {
      const result = diffText('hello\nworld', 'hello\nworld');
      const unchangedLine = result.lines.find((l) => l.type === 'unchanged');
      expect(unchangedLine?.oldLineNumber).toBeDefined();
      expect(unchangedLine?.newLineNumber).toBeDefined();
    });

    it('includes old line number for removed lines', () => {
      const result = diffText('hello\nworld', 'hello');
      const removedLine = result.lines.find((l) => l.type === 'removed');
      expect(removedLine?.oldLineNumber).toBeDefined();
    });

    it('includes new line number for added lines', () => {
      const result = diffText('hello', 'hello\nworld');
      const addedLine = result.lines.find((l) => l.type === 'added');
      expect(addedLine?.newLineNumber).toBeDefined();
    });

    it('handles multiple additions at once', () => {
      const result = diffText('a', 'a\nb\nc\nd');
      expect(result.stats.added).toBe(3);
      expect(result.stats.unchanged).toBe(1);
    });

    it('handles multiple removals at once', () => {
      const result = diffText('a\nb\nc\nd', 'a');
      expect(result.stats.removed).toBe(3);
      expect(result.stats.unchanged).toBe(1);
    });

    it('handles interleaved changes', () => {
      const result = diffText('a\nb\nc', 'a\nx\nc');
      // The LCS algorithm may find different results
      expect(result.stats.unchanged).toBeGreaterThanOrEqual(1);
    });

    it('handles complete replacement', () => {
      const result = diffText('old', 'new');
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(0);
    });
  });
});
