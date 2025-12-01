import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { InputOutput } from '../../../components/shared/InputOutput';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { encodeBase64, decodeBase64 } from '../../../utils/converters/base64';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, Binary } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('base64-encoder');
  }, [addRecentTool]);

  const handleEncode = () => {
    try {
      const encoded = encodeBase64(input);
      setOutput(encoded);
      setError('');
      setMode('encode');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64(input);
      setOutput(decoded);
      setError('');
      setMode('decode');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    setInput('Hello, World! This is a sample text to encode.');
    setMode('encode');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Base64 Encoder/Decoder - Free Online Base64 Tool",
        description: "Encode and decode Base64 strings online with our free Base64 tool. Convert text to Base64 encoding or decode Base64 to text instantly. Works entirely in your browser - fast, secure, and no data upload required.",
        keywords: "base64 encoder, base64 decoder, base64 online, encode base64, decode base64, base64 tool, base64 converter, free base64",
        path: "/tools/base64-encoder"
      }}
      icon={Binary}
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 strings back to text"
      category="encoders"
      actions={
        <>
          <Button onClick={handleEncode} size="sm">Encode</Button>
          <Button onClick={handleDecode} variant="outline" size="sm">
            Decode
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >
      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/10">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <InputOutput
        input={
          <Textarea
            placeholder={
              mode === 'encode'
                ? 'Enter text to encode...'
                : 'Paste Base64 string to decode...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder={
              mode === 'encode' ? 'Base64 encoded output...' : 'Decoded text will appear here...'
            }
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />
    </ToolPageLayout>
  );
}
