import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { formatCSS, minifyCSS } from '../../../utils/formatters/code';
import { Minimize2 } from 'lucide-react';
import { SEO } from '../../../utils/seo';

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
    <>
      <SEO
        title="CSS Minifier - Free Online CSS Compressor and Beautifier"
        description="Minify and beautify CSS code online. Free CSS minifier that compresses CSS for production and beautifies for development. Reduce file size and improve load times."
        keywords="css minifier, css compressor, minify css, compress css, css beautifier, css formatter, optimize css, free css tool"
        path="/tools/css-minifier"
      />
      <div className="space-y-6">
      {/* Compact Hero Section with Breadcrumb & Actions */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          {/* Breadcrumb Navigation */}
        <div className="px-6 pt-4 pb-2">
          <Breadcrumb />
        </div>

        {/* Single Row: Title, Icon & Action Buttons */}
          <div className="flex items-center justify-between gap-4 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Minimize2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CSS Minifier</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Minify and beautify CSS code
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={handleMinify} size="sm">Minify</Button>
              <Button onClick={handleBeautify} variant="outline" size="sm">Beautify</Button>
              <Button onClick={loadSample} variant="ghost" size="sm">
                Load Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

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
      </div>
    </>
  );
}
