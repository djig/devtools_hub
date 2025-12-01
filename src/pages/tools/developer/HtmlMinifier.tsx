import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { formatHTML, minifyHTML } from '../../../utils/formatters/code';
import { Minimize2 } from 'lucide-react';

export default function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('html-minifier');
  }, [addRecentTool]);

  const handleMinify = () => {
    setOutput(minifyHTML(input));
  };

  const handleBeautify = () => {
    setOutput(formatHTML(input));
  };

  const loadSample = () => {
    setInput('<div class="container">\n  <h1>Hello World</h1>\n  <!-- Comment -->\n  <p>Welcome!</p>\n</div>');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "HTML Minifier - Free Online HTML Compressor and Beautifier",
        description: "Minify and beautify HTML code online. Free HTML minifier that compresses HTML for production and beautifies for development. Optimize your web pages.",
        keywords: "html minifier, html compressor, minify html, compress html, html beautifier, html formatter, optimize html, free html tool",
        path: "/tools/html-minifier"
      }}
      icon={Minimize2}
      title="HTML Minifier"
      description="Minify and beautify HTML code"
      category="developer"
      actions={
        <>
          <Button onClick={handleMinify} size="sm">Minify</Button>
          <Button onClick={handleBeautify} variant="outline" size="sm">Beautify</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input HTML</label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="html"
            placeholder="Paste your HTML here..."
            height="400px"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Output</label>
          <CodeEditor
            value={output}
            language="html"
            readOnly
            placeholder="Processed HTML will appear here..."
            height="400px"
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
