import { describe, it, expect } from 'vitest';
import { generateUuidV4, generateMultipleUuids, isValidUuid } from './uuid';

describe('uuid', () => {
  describe('generateUuidV4', () => {
    it('generates a valid UUID v4', () => {
      const uuid = generateUuidV4();
      expect(isValidUuid(uuid)).toBe(true);
    });

    it('generates unique UUIDs', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUuidV4());
      }
      expect(uuids.size).toBe(100);
    });

    it('generates correct format', () => {
      const uuid = generateUuidV4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('generates lowercase UUIDs', () => {
      const uuid = generateUuidV4();
      expect(uuid).toBe(uuid.toLowerCase());
    });
  });

  describe('generateMultipleUuids', () => {
    it('generates correct count', () => {
      const uuids = generateMultipleUuids(5);
      expect(uuids).toHaveLength(5);
    });

    it('generates valid UUIDs', () => {
      const uuids = generateMultipleUuids(10);
      uuids.forEach((uuid) => {
        expect(isValidUuid(uuid)).toBe(true);
      });
    });

    it('generates unique UUIDs', () => {
      const uuids = generateMultipleUuids(50);
      const unique = new Set(uuids);
      expect(unique.size).toBe(50);
    });

    it('handles zero count', () => {
      const uuids = generateMultipleUuids(0);
      expect(uuids).toHaveLength(0);
    });

    it('handles one count', () => {
      const uuids = generateMultipleUuids(1);
      expect(uuids).toHaveLength(1);
      expect(isValidUuid(uuids[0])).toBe(true);
    });

    it('handles large count', () => {
      const uuids = generateMultipleUuids(100);
      expect(uuids).toHaveLength(100);
    });
  });

  describe('isValidUuid', () => {
    it('returns true for valid UUID v4', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('returns true for generated UUID', () => {
      const uuid = generateUuidV4();
      expect(isValidUuid(uuid)).toBe(true);
    });

    it('returns false for invalid format', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });

    it('returns false for incomplete UUID', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716')).toBe(false);
    });

    it('returns false for invalid characters', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-44665544gggg')).toBe(false);
    });

    it('returns false for invalid version', () => {
      expect(isValidUuid('550e8400-e29b-61d4-a716-446655440000')).toBe(false);
    });

    it('handles uppercase UUIDs', () => {
      expect(isValidUuid('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });

    it('handles mixed case UUIDs', () => {
      expect(isValidUuid('550E8400-e29b-41D4-a716-446655440000')).toBe(true);
    });
  });
});
