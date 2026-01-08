import { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { cn } from '../../lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'sql',
  readOnly = false,
  placeholder,
  className,
  height = '400px',
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;

    // Define custom theme matching the app's dark theme
    monaco.editor.defineTheme('devtools-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '60A5FA', fontStyle: 'bold' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'F472B6' },
        { token: 'type', foreground: '818CF8' },
        { token: 'function', foreground: 'A78BFA' },
        { token: 'variable', foreground: 'E5E7EB' },
        { token: 'operator', foreground: '60A5FA' },
        { token: 'delimiter', foreground: '9CA3AF' },
        { token: 'tag', foreground: '60A5FA' },
        { token: 'attribute.name', foreground: 'A78BFA' },
        { token: 'attribute.value', foreground: '34D399' },
      ],
      colors: {
        // Editor colors matching dark theme
        'editor.background': '#0c1222', // hsl(222.2 84% 4.9%) converted
        'editor.foreground': '#f9fafb', // hsl(210 40% 98%)
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#3b4f74',
        'editor.inactiveSelectionBackground': '#2d3a52',

        // Line numbers and gutter
        'editorLineNumber.foreground': '#6B7280',
        'editorLineNumber.activeForeground': '#60A5FA',
        'editorGutter.background': '#0c1222',

        // Cursor
        'editorCursor.foreground': '#60A5FA',

        // Selection
        'editor.selectionHighlightBackground': '#2d3a5233',

        // Brackets
        'editorBracketMatch.background': '#2d3a5266',
        'editorBracketMatch.border': '#60A5FA',

        // Scrollbar matching app's scrollbar
        'scrollbarSlider.background': '#4b5563',
        'scrollbarSlider.hoverBackground': '#6B7280',
        'scrollbarSlider.activeBackground': '#9CA3AF',

        // Input border matching --input
        'input.background': '#1e293b',
        'input.border': '#1e293b',

        // Widget colors
        'editorWidget.background': '#1e293b',
        'editorWidget.border': '#374151',
        'editorSuggestWidget.background': '#1e293b',
        'editorSuggestWidget.border': '#374151',
        'editorSuggestWidget.selectedBackground': '#3b4f74',

        // Find widget
        'editorFindMatch.background': '#3b4f7466',
        'editorFindMatchHighlight.background': '#2d3a5233',
      },
    });

    // Apply the custom theme
    monaco.editor.setTheme('devtools-dark');
  };

  const handleChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className={cn('rounded-md border border-input overflow-hidden', className)}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme="devtools-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingStrategy: 'advanced',
          automaticLayout: true,
          padding: { top: 10, bottom: 10 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          placeholder: placeholder,
        }}
      />
    </div>
  );
}
