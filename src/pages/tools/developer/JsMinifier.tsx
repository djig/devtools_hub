import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { InputOutput } from '../../../components/shared/InputOutput';
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

      <InputOutput
        input={
          <Textarea
            placeholder="Paste your JavaScript here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Processed JavaScript will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />
    </ToolPageLayout>
  );
}
