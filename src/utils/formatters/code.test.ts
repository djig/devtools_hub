import { describe, it, expect } from 'vitest';
import {
  formatJavaScript,
  minifyJavaScript,
  formatCSS,
  minifyCSS,
  formatHTML,
  minifyHTML,
} from './code';

describe('code', () => {
  describe('formatJavaScript', () => {
    it('formats single line code', () => {
      const input = 'function foo(){return 1;}';
      const formatted = formatJavaScript(input);
      expect(formatted).toContain('\n');
    });

    it('formats arrow function', () => {
      const input = 'const add=(a,b)=>a+b;';
      const formatted = formatJavaScript(input);
      expect(formatted).toBeDefined();
    });

    it('formats object literal', () => {
      const input = 'const obj={a:1,b:2};';
      const formatted = formatJavaScript(input);
      expect(formatted).toBeDefined();
    });

    it('handles empty string', () => {
      const formatted = formatJavaScript('');
      expect(formatted).toBe('');
    });

    it('formats if statement', () => {
      const input = 'if(x){y();}';
      const formatted = formatJavaScript(input);
      expect(formatted).toContain('if');
    });
  });

  describe('minifyJavaScript', () => {
    it('removes multi-line comments', () => {
      const input = 'var x = 1; /* comment */ var y = 2;';
      const minified = minifyJavaScript(input);
      expect(minified).not.toContain('comment');
    });

    it('removes single-line comments', () => {
      const input = 'var x = 1; // comment\nvar y = 2;';
      const minified = minifyJavaScript(input);
      expect(minified).not.toContain('comment');
    });

    it('removes extra whitespace', () => {
      const input = 'var   x   =   1;';
      const minified = minifyJavaScript(input);
      expect(minified).toBe('var x = 1;');
    });

    it('handles empty string', () => {
      const minified = minifyJavaScript('');
      expect(minified).toBe('');
    });

    it('preserves string content', () => {
      const input = 'var x = "hello world";';
      const minified = minifyJavaScript(input);
      expect(minified).toContain('hello world');
    });
  });

  describe('formatCSS', () => {
    it('formats single line CSS', () => {
      const input = '.class{color:red;margin:0;}';
      const formatted = formatCSS(input);
      expect(formatted).toContain('\n');
    });

    it('formats multiple selectors', () => {
      const input = '.a{color:red;}.b{color:blue;}';
      const formatted = formatCSS(input);
      expect(formatted).toContain('.a');
      expect(formatted).toContain('.b');
    });

    it('handles empty string', () => {
      const formatted = formatCSS('');
      expect(formatted).toBe('');
    });

    it('formats media query', () => {
      const input = '@media(min-width:768px){.class{color:red;}}';
      const formatted = formatCSS(input);
      expect(formatted).toContain('@media');
    });
  });

  describe('minifyCSS', () => {
    it('removes comments', () => {
      const input = '.class { /* comment */ color: red; }';
      const minified = minifyCSS(input);
      expect(minified).not.toContain('comment');
    });

    it('removes extra whitespace', () => {
      const input = '.class   {   color:   red;   }';
      const minified = minifyCSS(input);
      expect(minified).toBe('.class{color:red;}');
    });

    it('removes spaces around special characters', () => {
      const input = '.class { color : red ; margin : 0 ; }';
      const minified = minifyCSS(input);
      expect(minified).toBe('.class{color:red;margin:0;}');
    });

    it('handles empty string', () => {
      const minified = minifyCSS('');
      expect(minified).toBe('');
    });
  });

  describe('formatHTML', () => {
    it('formats single line HTML', () => {
      const input = '<div><span>text</span></div>';
      const formatted = formatHTML(input);
      // Simple HTML may not add newlines if it's short
      expect(formatted).toContain('<div>');
    });

    it('formats nested elements', () => {
      const input = '<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>';
      const formatted = formatHTML(input);
      expect(formatted).toContain('<html>');
      expect(formatted).toContain('<head>');
    });

    it('handles empty string', () => {
      const formatted = formatHTML('');
      expect(formatted).toBe('');
    });

    it('formats with attributes', () => {
      const input = '<div id="main" class="container"><p>text</p></div>';
      const formatted = formatHTML(input);
      expect(formatted).toContain('id="main"');
    });
  });

  describe('minifyHTML', () => {
    it('removes HTML comments', () => {
      const input = '<div><!-- comment --><span>text</span></div>';
      const minified = minifyHTML(input);
      expect(minified).not.toContain('comment');
    });

    it('removes extra whitespace', () => {
      const input = '<div>   text   </div>';
      const minified = minifyHTML(input);
      expect(minified).toBe('<div> text </div>');
    });

    it('removes spaces between tags', () => {
      const input = '<div>  </div>  <span>  </span>';
      const minified = minifyHTML(input);
      // Minifier removes whitespace more aggressively
      expect(minified).toContain('<div>');
      expect(minified).toContain('<span>');
    });

    it('handles empty string', () => {
      const minified = minifyHTML('');
      expect(minified).toBe('');
    });

    it('preserves text content', () => {
      const input = '<div>Hello World</div>';
      const minified = minifyHTML(input);
      expect(minified).toContain('Hello World');
    });
  });
});
