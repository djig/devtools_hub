import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import {
  formatJson,
  minifyJson,
  formatYaml,
  formatXml,
  formatJavaScript,
  formatCSS,
  formatHTML,
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  jsonToTypeScript,
  markdownToHtml,
  htmlToMarkdown,
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  generateUuidV4,
  generateMD5,
  generateSHA256,
  generateSHA512,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toUppercase,
  toLowercase,
} from '@devtools-hub/core';

type Category = 'formatters' | 'converters' | 'encoders' | 'generators' | 'text';

interface Tool {
  id: string;
  name: string;
  action: (input: string) => string;
  placeholder?: string;
  needsInput?: boolean;
}

const TOOLS: Record<Category, Tool[]> = {
  formatters: [
    { id: 'format-json', name: 'Format JSON', action: formatJson, placeholder: '{"key": "value"}' },
    { id: 'minify-json', name: 'Minify JSON', action: minifyJson, placeholder: '{ "key": "value" }' },
    { id: 'format-yaml', name: 'Format YAML', action: formatYaml, placeholder: 'key: value' },
    { id: 'format-xml', name: 'Format XML', action: formatXml, placeholder: '<root><item/></root>' },
    { id: 'format-js', name: 'Format JavaScript', action: formatJavaScript, placeholder: 'function test(){return 1}' },
    { id: 'format-css', name: 'Format CSS', action: formatCSS, placeholder: 'body{margin:0}' },
    { id: 'format-html', name: 'Format HTML', action: formatHTML, placeholder: '<div><span>text</span></div>' },
  ],
  converters: [
    { id: 'json-to-yaml', name: 'JSON → YAML', action: jsonToYaml, placeholder: '{"name": "test"}' },
    { id: 'yaml-to-json', name: 'YAML → JSON', action: yamlToJson, placeholder: 'name: test' },
    { id: 'json-to-xml', name: 'JSON → XML', action: jsonToXml, placeholder: '{"root": {"item": "value"}}' },
    { id: 'xml-to-json', name: 'XML → JSON', action: xmlToJson, placeholder: '<root><item>value</item></root>' },
    { id: 'json-to-csv', name: 'JSON → CSV', action: jsonToCsv, placeholder: '[{"name": "Alice", "age": 30}]' },
    { id: 'csv-to-json', name: 'CSV → JSON', action: csvToJson, placeholder: 'name,age\nAlice,30' },
    { id: 'json-to-ts', name: 'JSON → TypeScript', action: jsonToTypeScript, placeholder: '{"name": "test", "count": 42}' },
    { id: 'md-to-html', name: 'Markdown → HTML', action: markdownToHtml, placeholder: '# Hello\n**bold**' },
    { id: 'html-to-md', name: 'HTML → Markdown', action: htmlToMarkdown, placeholder: '<h1>Hello</h1><b>bold</b>' },
  ],
  encoders: [
    { id: 'encode-base64', name: 'Encode Base64', action: encodeBase64, placeholder: 'Hello World' },
    { id: 'decode-base64', name: 'Decode Base64', action: decodeBase64, placeholder: 'SGVsbG8gV29ybGQ=' },
    { id: 'encode-url', name: 'URL Encode', action: encodeUrl, placeholder: 'hello world' },
    { id: 'decode-url', name: 'URL Decode', action: decodeUrl, placeholder: 'hello%20world' },
  ],
  generators: [
    { id: 'generate-uuid', name: 'Generate UUID', action: generateUuidV4, needsInput: false },
    { id: 'generate-md5', name: 'MD5 Hash', action: generateMD5, placeholder: 'text to hash' },
    { id: 'generate-sha256', name: 'SHA-256 Hash', action: generateSHA256, placeholder: 'text to hash' },
    { id: 'generate-sha512', name: 'SHA-512 Hash', action: generateSHA512, placeholder: 'text to hash' },
  ],
  text: [
    { id: 'to-camel', name: 'camelCase', action: toCamelCase, placeholder: 'hello world' },
    { id: 'to-pascal', name: 'PascalCase', action: toPascalCase, placeholder: 'hello world' },
    { id: 'to-snake', name: 'snake_case', action: toSnakeCase, placeholder: 'helloWorld' },
    { id: 'to-kebab', name: 'kebab-case', action: toKebabCase, placeholder: 'helloWorld' },
    { id: 'to-constant', name: 'CONSTANT_CASE', action: toConstantCase, placeholder: 'hello world' },
    { id: 'to-title', name: 'Title Case', action: toTitleCase, placeholder: 'hello world' },
    { id: 'to-upper', name: 'UPPERCASE', action: toUppercase, placeholder: 'hello world' },
    { id: 'to-lower', name: 'lowercase', action: toLowercase, placeholder: 'HELLO WORLD' },
  ],
};

interface ToolPanelProps {
  category: Category;
}

export function ToolPanel({ category }: ToolPanelProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const tools = TOOLS[category];

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool.id);
    setOutput('');
    setError('');

    if (!tool.needsInput && tool.needsInput !== undefined) {
      // Tool doesn't need input (like UUID generator)
      try {
        const result = tool.action('');
        setOutput(result);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleExecute = () => {
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool || (!input.trim() && tool.needsInput !== false)) return;

    try {
      const result = tool.action(input);
      setOutput(result);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const currentTool = tools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-2">
      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-1.5">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className={`px-2.5 py-1.5 text-xs rounded-md transition-colors text-left truncate ${
              selectedTool === tool.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {/* Input/Output area */}
      {selectedTool && currentTool && (
        <div className="space-y-2 mt-3">
          {/* Input */}
          {currentTool.needsInput !== false && (
            <div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentTool.placeholder || 'Enter text...'}
                className="w-full h-20 px-3 py-2 text-xs bg-black/30 border border-white/10 rounded-lg
                         text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleExecute}
                disabled={!input.trim()}
                className="w-full mt-1 px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700
                         disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Execute
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          )}

          {/* Output */}
          {output && (
            <div className="relative">
              <pre className="w-full min-h-[60px] max-h-40 overflow-auto p-3 text-xs bg-black/30
                            border border-white/10 rounded-lg text-green-300 whitespace-pre-wrap">
                {output}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="text-white/60" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
