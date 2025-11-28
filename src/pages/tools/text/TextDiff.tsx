import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { diffText } from '../../../utils/text/diff';
import type { DiffResult } from '../../../utils/text/diff';
import { GitCompare } from 'lucide-react';

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('text-diff');
  }, [addRecentTool]);

  const handleCompare = () => {
    const result = diffText(text1, text2);
    setDiffResult(result);
  };

  const loadSample = () => {
    setText1('Hello World\nThis is a test\nLine three\nLine four');
    setText2('Hello World\nThis is a demo\nLine three\nLine five\nLine six');
  };

  return (
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
                <GitCompare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Text Diff</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Compare two texts and see the differences
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button onClick={handleCompare} size="sm">Compare</Button>
              <Button onClick={loadSample} variant="ghost" size="sm">
                Load Sample
              </Button>
              {diffResult && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 dark:text-green-400">
                      +{diffResult.stats.added} added
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      -{diffResult.stats.removed} removed
                    </span>
                    <span className="text-muted-foreground">
                      {diffResult.stats.unchanged} unchanged
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Original Text
          </h3>
          <Textarea
            placeholder="Enter original text..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Modified Text
          </h3>
          <Textarea
            placeholder="Enter modified text..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </Card>
      </div>

      {diffResult && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Diff Result
          </h3>
          <div className="rounded border border-border overflow-hidden">
            <div className="max-h-[500px] overflow-auto">
              {diffResult.lines.map((line, index) => (
                <div
                  key={index}
                  className={`flex font-mono text-sm border-b border-border last:border-0 ${
                    line.type === 'added'
                      ? 'bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100'
                      : line.type === 'removed'
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100'
                      : 'bg-background'
                  }`}
                >
                  <div className="flex-shrink-0 w-16 px-2 py-1 text-center text-muted-foreground border-r border-border bg-muted/50">
                    {line.oldLineNumber || ''}
                  </div>
                  <div className="flex-shrink-0 w-16 px-2 py-1 text-center text-muted-foreground border-r border-border bg-muted/50">
                    {line.newLineNumber || ''}
                  </div>
                  <div className="flex-shrink-0 w-8 px-2 py-1 text-center font-bold border-r border-border">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </div>
                  <div className="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
                    {line.content || ' '}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
