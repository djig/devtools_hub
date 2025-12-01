import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { CopyButton } from '../../../components/shared/CopyButton';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { generateMultipleUuids } from '../../../utils/generators/uuid';
import useAppStore from '../../../store/useAppStore';
import { RefreshCw, Hash } from 'lucide-react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('uuid-generator');
    generateUuids();
  }, [addRecentTool]);

  const generateUuids = () => {
    const generated = generateMultipleUuids(count);
    setUuids(generated);
  };

  return (
    <ToolPageLayout
      seo={{
        title: "UUID Generator - Free Online UUID/GUID Generator",
        description: "Generate UUIDs (v4) and GUIDs online. Free UUID generator that creates universally unique identifiers instantly. Bulk generation supported. Secure and random.",
        keywords: "uuid generator, guid generator, generate uuid, uuid v4, unique id generator, random uuid, uuid tool, free uuid generator",
        path: "/tools/uuid-generator"
      }}
      icon={Hash}
      title="UUID Generator"
      description="Generate universally unique identifiers (UUIDs) version 4"
      category="generators"
      actions={
        <>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              Generate:
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-20 h-8"
            />
            <span className="text-xs text-muted-foreground">UUIDs</span>
          </div>
          <Button onClick={generateUuids} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </>
      }
    >

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Generated UUIDs</h3>
          {uuids.length > 0 && <CopyButton text={uuids.join('\n')} />}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <code className="text-sm font-mono flex-1">{uuid}</code>
              <CopyButton text={uuid} />
            </div>
          ))}
        </div>

        {uuids.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            Click "Generate" to create UUIDs
          </p>
        )}
      </Card>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About UUID v4</h3>
        <p className="text-sm text-muted-foreground">
          UUID version 4 generates random 128-bit identifiers. The probability of collision is
          extremely low, making them suitable for distributed systems. Format:{' '}
          <code className="text-xs">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
        </p>
      </Card>
    </ToolPageLayout>
  );
}
