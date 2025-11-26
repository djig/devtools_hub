import { js as jsBeautify, css as cssBeautify, html as htmlBeautify } from 'js-beautify';

export function formatJavaScript(code: string): string {
  return jsBeautify(code, {
    indent_size: 2,
    space_in_empty_paren: false,
  });
}

export function minifyJavaScript(code: string): string {
  // Basic minification - remove extra whitespace and line breaks
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/.*/g, '') // Remove single-line comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export function formatCSS(code: string): string {
  return cssBeautify(code, {
    indent_size: 2,
  });
}

export function minifyCSS(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around special chars
    .trim();
}

export function formatHTML(code: string): string {
  return htmlBeautify(code, {
    indent_size: 2,
    wrap_line_length: 80,
  });
}

export function minifyHTML(code: string): string {
  return code
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\s+/g, ' ') // Replace multiple spaces
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .trim();
}
