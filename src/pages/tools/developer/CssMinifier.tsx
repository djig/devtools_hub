import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { formatCSS, minifyCSS } from '../../../utils/formatters/code';
import { Minimize2 } from 'lucide-react';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('css-minifier');
  }, [addRecentTool]);

  const handleMinify = () => {
    setOutput(minifyCSS(input));
  };

  const handleBeautify = () => {
    setOutput(formatCSS(input));
  };

  const loadSample = () => {
    setInput('.container {\n  display: flex;\n  justify-content: center;\n  /* Comment */\n  padding: 20px;\n}');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "CSS Minifier - Free Online CSS Compressor and Beautifier",
        description: "Minify and beautify CSS code online. Free CSS minifier that compresses CSS for production and beautifies for development. Reduce file size and improve load times.",
        keywords: "css minifier, css compressor, minify css, compress css, css beautifier, css formatter, optimize css, free css tool",
        path: "/tools/css-minifier"
      }}
      icon={Minimize2}
      title="CSS Minifier"
      description="Minify and beautify CSS code"
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
          <label className="text-sm font-medium">Input CSS</label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="css"
            placeholder="Paste your CSS here..."
            height="400px"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Output</label>
          <CodeEditor
            value={output}
            language="css"
            readOnly
            placeholder="Processed CSS will appear here..."
            height="400px"
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
