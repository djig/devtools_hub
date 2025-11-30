import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { formatJavaScript, minifyJavaScript } from '../../../utils/formatters/code';
import { Minimize2 } from 'lucide-react';

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('js-minifier');
  }, [addRecentTool]);

  const handleMinify = () => {
    setOutput(minifyJavaScript(input));
  };

  const handleBeautify = () => {
    setOutput(formatJavaScript(input));
  };

  const loadSample = () => {
    setInput('function greet(name) {\n  // Welcome message\n  console.log("Hello, " + name);\n  return true;\n}');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "JavaScript Minifier - Free Online JS Compressor and Beautifier",
        description: "Minify and beautify JavaScript code online. Free JS minifier that compresses JavaScript for production and beautifies for development. Reduce file size instantly.",
        keywords: "javascript minifier, js minifier, minify javascript, compress js, javascript beautifier, js formatter, optimize javascript, free js tool",
        path: "/tools/js-minifier"
      }}
      icon={Minimize2}
      title="JavaScript Minifier"
      description="Minify and beautify JavaScript code"
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
          <label className="text-sm font-medium">Input JavaScript</label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="javascript"
            placeholder="Paste your JavaScript here..."
            height="400px"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Output</label>
          <CodeEditor
            value={output}
            language="javascript"
            readOnly
            placeholder="Processed JavaScript will appear here..."
            height="400px"
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
