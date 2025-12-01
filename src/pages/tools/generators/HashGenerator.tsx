import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CopyButton } from '../../../components/shared/CopyButton';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { generateAllHashes } from '../../../utils/generators/hash';
import { Shield } from 'lucide-react';

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
    <ToolPageLayout
      seo={{
        title: "Hash Generator - MD5, SHA1, SHA256, SHA512 Hash Calculator",
        description: "Generate MD5, SHA1, SHA256, and SHA512 hashes online. Free hash generator for checksums and data integrity verification. Works entirely in your browser.",
        keywords: "hash generator, md5 generator, sha256 generator, hash calculator, checksum generator, hash tool, md5 hash, sha512, free hash generator",
        path: "/tools/hash-generator"
      }}
      icon={Shield}
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text"
      category="generators"
      actions={
        <Button onClick={loadSample} variant="outline" size="sm">
          Load Sample
        </Button>
      }
    >

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
    </ToolPageLayout>
  );
}
