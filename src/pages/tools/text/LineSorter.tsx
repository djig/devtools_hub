import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';

export default function LineSorter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('line-sorter');
  }, [addRecentTool]);

  const handleSort = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let lines = input.split('\n');

    if (removeDuplicates) {
      lines = [...new Set(lines)];
    }

    lines.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });

    setOutput(lines.join('\n'));
  };

  const loadSample = () => {
    setInput('banana\napple\ncherry\napple\ndate\nbanana\neldberberry');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Line Sorter</h1>
        <p className="text-muted-foreground">
          Sort and deduplicate lines of text alphabetically
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="asc">A → Z (Ascending)</option>
              <option value="desc">Z → A (Descending)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="rounded"
            />
            Remove Duplicates
          </label>

          <Button onClick={handleSort}>Sort Lines</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </div>
      </Card>

      <InputOutput
        input={
          <Textarea
            placeholder="Enter lines to sort..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Sorted lines will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />
    </div>
  );
}
