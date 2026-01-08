import { describe, it, expect } from 'vitest';
import { countText } from './counter';

describe('counter', () => {
  describe('countText', () => {
    it('counts characters', () => {
      const result = countText('hello');
      expect(result.characters).toBe(5);
    });

    it('counts characters with spaces', () => {
      const result = countText('hello world');
      expect(result.characters).toBe(11);
    });

    it('counts characters without spaces', () => {
      const result = countText('hello world');
      expect(result.charactersNoSpaces).toBe(10);
    });

    it('counts words', () => {
      const result = countText('hello world');
      expect(result.words).toBe(2);
    });

    it('counts words with multiple spaces', () => {
      const result = countText('hello   world');
      expect(result.words).toBe(2);
    });

    it('counts lines', () => {
      const result = countText('line1\nline2\nline3');
      expect(result.lines).toBe(3);
    });

    it('counts single line', () => {
      const result = countText('single line');
      expect(result.lines).toBe(1);
    });

    it('counts sentences', () => {
      const result = countText('Hello. World. Test.');
      expect(result.sentences).toBe(3);
    });

    it('counts sentences with different punctuation', () => {
      const result = countText('Hello! How are you? I am fine.');
      expect(result.sentences).toBe(3);
    });

    it('counts paragraphs', () => {
      const result = countText('Paragraph 1.\n\nParagraph 2.\n\nParagraph 3.');
      expect(result.paragraphs).toBe(3);
    });

    it('calculates reading time', () => {
      // 200 words = 1 minute
      const words = Array(200).fill('word').join(' ');
      const result = countText(words);
      expect(result.readingTime).toBe(1);
    });

    it('rounds up reading time', () => {
      // 201 words = 2 minutes (rounded up)
      const words = Array(201).fill('word').join(' ');
      const result = countText(words);
      expect(result.readingTime).toBe(2);
    });

    it('handles empty string', () => {
      const result = countText('');
      expect(result.characters).toBe(0);
      expect(result.charactersNoSpaces).toBe(0);
      expect(result.words).toBe(0);
      expect(result.lines).toBe(0);
      expect(result.sentences).toBe(0);
      expect(result.paragraphs).toBe(0);
      expect(result.readingTime).toBe(0);
    });

    it('handles whitespace only', () => {
      const result = countText('   ');
      expect(result.characters).toBe(3);
      expect(result.charactersNoSpaces).toBe(0);
      expect(result.words).toBe(0);
    });

    it('handles newlines only', () => {
      const result = countText('\n\n\n');
      expect(result.characters).toBe(3);
      expect(result.lines).toBe(4);
    });

    it('handles tabs', () => {
      const result = countText('hello\tworld');
      expect(result.characters).toBe(11);
      expect(result.charactersNoSpaces).toBe(10);
    });

    it('returns correct reading time for short text', () => {
      const result = countText('Hello world');
      expect(result.readingTime).toBe(1); // Minimum 1 minute
    });
  });
});
