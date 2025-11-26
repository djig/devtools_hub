import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { generateAllHashes } from '../../../utils/generators/hash';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<any>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('hash-generator');
  }, [addRecentTool]);

  const handleGenerate = () => {
    if (!input) {
      setHashes(null);
      return;
    }
    const result = generateAllHashes(input);
    setHashes(result);
  };

  useEffect(() => {
    if (input) {
      handleGenerate();
    } else {
      setHashes(null);
    }
  }, [input]);

  const loadSample = () => {
    setInput('Hello, World!');
  };

  const hashTypes = hashes
    ? [
        { label: 'MD5', value: hashes.md5 },
        { label: 'SHA-1', value: hashes.sha1 },
        { label: 'SHA-256', value: hashes.sha256 },
        { label: 'SHA-512', value: hashes.sha512 },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Button onClick={loadSample} variant="outline" size="sm">
            Load Sample
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Input Text</h3>
        <Textarea
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px]"
        />
      </Card>

      {hashTypes.length > 0 && (
        <div className="space-y-4">
          {hashTypes.map((hash) => (
            <Card key={hash.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {hash.label}
                </h3>
                <CopyButton text={hash.value} />
              </div>
              <div className="p-3 rounded bg-muted/50 break-all font-mono text-sm">
                {hash.value}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!hashes && (
        <Card className="p-8 text-center text-muted-foreground">
          Enter text above to generate hashes
        </Card>
      )}
    </div>
  );
}
