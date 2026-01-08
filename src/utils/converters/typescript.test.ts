import { describe, it, expect } from 'vitest';
import { jsonToTypeScript, defaultOptions } from './typescript';

describe('typescript', () => {
  describe('jsonToTypeScript', () => {
    describe('simple objects', () => {
      it('converts simple object with primitives', () => {
        const json = JSON.stringify({ name: 'test', age: 42, active: true });
        const result = jsonToTypeScript(json);
        expect(result).toContain('export interface Root');
        expect(result).toContain('name: string;');
        expect(result).toContain('age: number;');
        expect(result).toContain('active: boolean;');
      });

      it('handles null values', () => {
        const json = JSON.stringify({ value: null });
        const result = jsonToTypeScript(json);
        expect(result).toContain('value: null;');
      });

      it('handles empty object', () => {
        const json = JSON.stringify({});
        const result = jsonToTypeScript(json);
        expect(result).toContain('export interface Root');
      });
    });

    describe('nested objects', () => {
      it('creates separate types for nested objects', () => {
        const json = JSON.stringify({
          person: {
            name: 'John',
            age: 30,
          },
        });
        const result = jsonToTypeScript(json);
        expect(result).toContain('export interface Root');
        expect(result).toContain('person: RootPerson;');
        expect(result).toContain('export interface RootPerson');
        expect(result).toContain('name: string;');
        expect(result).toContain('age: number;');
      });

      it('handles deeply nested objects', () => {
        const json = JSON.stringify({
          level1: {
            level2: {
              level3: {
                value: 'deep',
              },
            },
          },
        });
        const result = jsonToTypeScript(json);
        expect(result).toContain('RootLevel1');
        expect(result).toContain('RootLevel1Level2');
        expect(result).toContain('RootLevel1Level2Level3');
      });
    });

    describe('arrays', () => {
      it('handles array of primitives', () => {
        const json = JSON.stringify({ items: ['a', 'b', 'c'] });
        const result = jsonToTypeScript(json);
        expect(result).toContain('items: string[];');
      });

      it('handles array of numbers', () => {
        const json = JSON.stringify({ numbers: [1, 2, 3] });
        const result = jsonToTypeScript(json);
        expect(result).toContain('numbers: number[];');
      });

      it('handles array of objects', () => {
        const json = JSON.stringify({
          users: [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
          ],
        });
        const result = jsonToTypeScript(json);
        expect(result).toContain('users: RootUsersItem[];');
        expect(result).toContain('export interface RootUsersItem');
      });

      it('handles empty array', () => {
        const json = JSON.stringify({ items: [] });
        const result = jsonToTypeScript(json);
        expect(result).toContain('items: unknown[];');
      });

      it('handles mixed type arrays', () => {
        const json = JSON.stringify({ mixed: [1, 'string', true] });
        const result = jsonToTypeScript(json);
        expect(result).toContain('mixed:');
        expect(result).toMatch(/number|string|boolean/);
      });

      it('handles root array', () => {
        const json = JSON.stringify([{ id: 1 }, { id: 2 }]);
        const result = jsonToTypeScript(json);
        expect(result).toContain('export type Root');
        expect(result).toContain('RootItem[]');
      });
    });

    describe('options', () => {
      it('uses type alias when useInterface is false', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { useInterface: false });
        expect(result).toContain('export type Root =');
        expect(result).not.toContain('interface');
      });

      it('removes export keyword when exportTypes is false', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { exportTypes: false });
        expect(result).not.toMatch(/^export/m);
        expect(result).toContain('interface Root');
      });

      it('adds optional marker when optionalProperties is true', () => {
        const json = JSON.stringify({ name: 'test', age: 42 });
        const result = jsonToTypeScript(json, { optionalProperties: true });
        expect(result).toContain('name?: string;');
        expect(result).toContain('age?: number;');
      });

      it('adds readonly modifier when readonlyProperties is true', () => {
        const json = JSON.stringify({ name: 'test', age: 42 });
        const result = jsonToTypeScript(json, { readonlyProperties: true });
        expect(result).toContain('readonly name: string;');
        expect(result).toContain('readonly age: number;');
      });

      it('adds JSDoc comments when addComments is true', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { addComments: true });
        expect(result).toContain('/** The name property */');
      });

      it('uses custom root name', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { rootName: 'User' });
        expect(result).toContain('export interface User');
      });

      it('converts root name to PascalCase', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { rootName: 'my-user-type' });
        expect(result).toContain('export interface MyUserType');
      });

      it('uses default root name when empty', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, { rootName: '' });
        expect(result).toContain('export interface Root');
      });

      it('combines multiple options', () => {
        const json = JSON.stringify({ name: 'test' });
        const result = jsonToTypeScript(json, {
          useInterface: false,
          exportTypes: true,
          optionalProperties: true,
          readonlyProperties: true,
          rootName: 'Config',
        });
        expect(result).toContain('export type Config =');
        expect(result).toContain('readonly name?: string;');
      });
    });

    describe('special property names', () => {
      it('quotes property names with special characters', () => {
        const json = JSON.stringify({ 'my-prop': 'test', 'another.prop': 42 });
        const result = jsonToTypeScript(json);
        expect(result).toContain("'my-prop': string;");
        expect(result).toContain("'another.prop': number;");
      });

      it('does not quote valid identifiers', () => {
        const json = JSON.stringify({ validName: 'test', _private: 42, $special: true });
        const result = jsonToTypeScript(json);
        expect(result).toContain('validName: string;');
        expect(result).toContain('_private: number;');
        expect(result).toContain('$special: boolean;');
      });
    });

    describe('error handling', () => {
      it('throws error for invalid JSON', () => {
        expect(() => jsonToTypeScript('not json')).toThrow('Invalid JSON');
      });

      it('throws error for malformed JSON', () => {
        expect(() => jsonToTypeScript('{name: test}')).toThrow('Invalid JSON');
      });
    });

    describe('primitive root values', () => {
      it('handles string root value', () => {
        const json = JSON.stringify('hello');
        const result = jsonToTypeScript(json);
        expect(result).toContain('export type Root = string;');
      });

      it('handles number root value', () => {
        const json = JSON.stringify(42);
        const result = jsonToTypeScript(json);
        expect(result).toContain('export type Root = number;');
      });

      it('handles boolean root value', () => {
        const json = JSON.stringify(true);
        const result = jsonToTypeScript(json);
        expect(result).toContain('export type Root = boolean;');
      });

      it('handles null root value', () => {
        const json = JSON.stringify(null);
        const result = jsonToTypeScript(json);
        expect(result).toContain('export type Root = null;');
      });
    });
  });

  describe('defaultOptions', () => {
    it('has expected default values', () => {
      expect(defaultOptions.useInterface).toBe(true);
      expect(defaultOptions.exportTypes).toBe(true);
      expect(defaultOptions.optionalProperties).toBe(false);
      expect(defaultOptions.readonlyProperties).toBe(false);
      expect(defaultOptions.addComments).toBe(false);
      expect(defaultOptions.rootName).toBe('Root');
    });
  });
});
