import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { InputOutput } from '../../../components/shared/InputOutput';
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
            placeholder="Paste your CSS here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Processed CSS will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />
    </ToolPageLayout>
  );
}
