import { describe, it, expect } from 'vitest';
import {
  generateMD5,
  generateSHA1,
  generateSHA256,
  generateSHA512,
  generateAllHashes,
} from './hash';

describe('hash', () => {
  describe('generateMD5', () => {
    it('generates correct hash for known input', () => {
      // Known MD5 hash for "hello"
      expect(generateMD5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('generates hash for empty string', () => {
      // Known MD5 hash for empty string
      expect(generateMD5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('generates 32 character hash', () => {
      const hash = generateMD5('test');
      expect(hash).toHaveLength(32);
    });

    it('generates lowercase hex string', () => {
      const hash = generateMD5('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = generateMD5('hello');
      const hash2 = generateMD5('world');
      expect(hash1).not.toBe(hash2);
    });

    it('generates consistent hash', () => {
      const hash1 = generateMD5('test');
      const hash2 = generateMD5('test');
      expect(hash1).toBe(hash2);
    });
  });

  describe('generateSHA1', () => {
    it('generates correct hash for known input', () => {
      // Known SHA1 hash for "hello"
      expect(generateSHA1('hello')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    it('generates 40 character hash', () => {
      const hash = generateSHA1('test');
      expect(hash).toHaveLength(40);
    });

    it('generates lowercase hex string', () => {
      const hash = generateSHA1('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = generateSHA1('hello');
      const hash2 = generateSHA1('world');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSHA256', () => {
    it('generates correct hash for known input', () => {
      // Known SHA256 hash for "hello"
      expect(generateSHA256('hello')).toBe(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
      );
    });

    it('generates 64 character hash', () => {
      const hash = generateSHA256('test');
      expect(hash).toHaveLength(64);
    });

    it('generates lowercase hex string', () => {
      const hash = generateSHA256('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = generateSHA256('hello');
      const hash2 = generateSHA256('world');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSHA512', () => {
    it('generates 128 character hash', () => {
      const hash = generateSHA512('test');
      expect(hash).toHaveLength(128);
    });

    it('generates lowercase hex string', () => {
      const hash = generateSHA512('test');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = generateSHA512('hello');
      const hash2 = generateSHA512('world');
      expect(hash1).not.toBe(hash2);
    });

    it('generates hash for empty string', () => {
      const hash = generateSHA512('');
      expect(hash).toHaveLength(128);
    });
  });

  describe('generateAllHashes', () => {
    it('returns all four hash types', () => {
      const hashes = generateAllHashes('test');
      expect(hashes).toHaveProperty('md5');
      expect(hashes).toHaveProperty('sha1');
      expect(hashes).toHaveProperty('sha256');
      expect(hashes).toHaveProperty('sha512');
    });

    it('returns correct length hashes', () => {
      const hashes = generateAllHashes('test');
      expect(hashes.md5).toHaveLength(32);
      expect(hashes.sha1).toHaveLength(40);
      expect(hashes.sha256).toHaveLength(64);
      expect(hashes.sha512).toHaveLength(128);
    });

    it('matches individual function outputs', () => {
      const input = 'hello';
      const hashes = generateAllHashes(input);
      expect(hashes.md5).toBe(generateMD5(input));
      expect(hashes.sha1).toBe(generateSHA1(input));
      expect(hashes.sha256).toBe(generateSHA256(input));
      expect(hashes.sha512).toBe(generateSHA512(input));
    });

    it('handles empty string', () => {
      const hashes = generateAllHashes('');
      expect(hashes.md5).toBeDefined();
      expect(hashes.sha1).toBeDefined();
      expect(hashes.sha256).toBeDefined();
      expect(hashes.sha512).toBeDefined();
    });

    it('handles unicode characters', () => {
      const hashes = generateAllHashes('hello 世界');
      expect(hashes.md5).toHaveLength(32);
      expect(hashes.sha1).toHaveLength(40);
      expect(hashes.sha256).toHaveLength(64);
      expect(hashes.sha512).toHaveLength(128);
    });
  });
});
