import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { encodeUrl, decodeUrl } from '../../../utils/converters/url';
import { AlertCircle } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('url-encoder');
  }, [addRecentTool]);

  const handleAction = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeUrl(input));
      } else {
        setOutput(decodeUrl(input));
      }
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('Hello World! Special chars: @#$%^&*()');
    } else {
      setInput('Hello%20World!%20Special%20chars%3A%20%40%23%24%25%5E%26*()');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">URL Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Encode and decode URL parameters and query strings
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleAction}>
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          <Button onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')} variant="outline">
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </div>
      </Card>

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
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL-encoded text...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder={mode === 'encode' ? 'Encoded URL...' : 'Decoded text...'}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />
    </div>
  );
}
