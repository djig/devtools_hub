import { describe, it, expect } from 'vitest';
import {
  generateLoremWords,
  generateLoremSentences,
  generateLoremParagraphs,
} from './lorem';

describe('lorem', () => {
  describe('generateLoremWords', () => {
    it('generates correct number of words', () => {
      const result = generateLoremWords(5);
      const words = result.split(' ');
      expect(words).toHaveLength(5);
    });

    it('generates zero words', () => {
      const result = generateLoremWords(0);
      expect(result).toBe('');
    });

    it('generates single word', () => {
      const result = generateLoremWords(1);
      const words = result.split(' ');
      expect(words).toHaveLength(1);
    });

    it('generates many words', () => {
      const result = generateLoremWords(100);
      const words = result.split(' ');
      expect(words).toHaveLength(100);
    });

    it('starts with lorem', () => {
      const result = generateLoremWords(10);
      expect(result.startsWith('lorem')).toBe(true);
    });

    it('contains lorem ipsum words', () => {
      const result = generateLoremWords(5);
      expect(result).toContain('lorem');
    });

    it('wraps around for large counts', () => {
      // More words than in the LOREM_WORDS array
      const result = generateLoremWords(100);
      expect(result.split(' ')).toHaveLength(100);
    });
  });

  describe('generateLoremSentences', () => {
    it('generates correct number of sentences', () => {
      const result = generateLoremSentences(3);
      const sentences = result.split('.').filter((s) => s.trim().length > 0);
      expect(sentences).toHaveLength(3);
    });

    it('generates zero sentences', () => {
      const result = generateLoremSentences(0);
      expect(result).toBe('');
    });

    it('generates single sentence', () => {
      const result = generateLoremSentences(1);
      const sentences = result.split('.').filter((s) => s.trim().length > 0);
      expect(sentences).toHaveLength(1);
    });

    it('starts with capital letter', () => {
      const result = generateLoremSentences(1);
      expect(result[0]).toBe(result[0].toUpperCase());
    });

    it('ends with period', () => {
      const result = generateLoremSentences(1);
      expect(result.trim().endsWith('.')).toBe(true);
    });

    it('each sentence starts with capital letter', () => {
      const result = generateLoremSentences(3);
      const sentences = result.split('.').filter((s) => s.trim().length > 0);
      sentences.forEach((sentence) => {
        const firstChar = sentence.trim()[0];
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });

    it('generates sentences with varying lengths', () => {
      // Multiple generations should produce some variation
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(generateLoremSentences(1).length);
      }
      // Check that not all sentences have the same length
      const unique = new Set(results);
      expect(unique.size).toBeGreaterThan(1);
    });
  });

  describe('generateLoremParagraphs', () => {
    it('generates correct number of paragraphs', () => {
      const result = generateLoremParagraphs(3);
      const paragraphs = result.split('\n\n').filter((p) => p.trim().length > 0);
      expect(paragraphs).toHaveLength(3);
    });

    it('generates zero paragraphs', () => {
      const result = generateLoremParagraphs(0);
      expect(result).toBe('');
    });

    it('generates single paragraph', () => {
      const result = generateLoremParagraphs(1);
      const paragraphs = result.split('\n\n').filter((p) => p.trim().length > 0);
      expect(paragraphs).toHaveLength(1);
    });

    it('separates paragraphs with double newlines', () => {
      const result = generateLoremParagraphs(2);
      expect(result).toContain('\n\n');
    });

    it('each paragraph contains sentences', () => {
      const result = generateLoremParagraphs(1);
      expect(result).toContain('.');
    });

    it('each paragraph starts with capital letter', () => {
      const result = generateLoremParagraphs(3);
      const paragraphs = result.split('\n\n').filter((p) => p.trim().length > 0);
      paragraphs.forEach((paragraph) => {
        const firstChar = paragraph.trim()[0];
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });

    it('paragraphs have varying lengths', () => {
      // Multiple generations should produce some variation
      const results = [];
      for (let i = 0; i < 10; i++) {
        const para = generateLoremParagraphs(1);
        results.push(para.length);
      }
      // Check that not all paragraphs have the same length
      const unique = new Set(results);
      expect(unique.size).toBeGreaterThan(1);
    });
  });
});
