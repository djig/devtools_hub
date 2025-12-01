import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { InputOutput } from '../../../components/shared/InputOutput';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { ArrowUpDown } from 'lucide-react';

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
    <ToolPageLayout
      seo={{
        title: "Line Sorter - Sort and Deduplicate Lines of Text Online",
        description: "Sort and deduplicate lines of text online. Free line sorter that arranges text alphabetically, numerically, or in reverse. Remove duplicate lines instantly.",
        keywords: "line sorter, sort lines, alphabetize lines, deduplicate lines, sort text, remove duplicates, unique lines, free sorter",
        path: "/tools/line-sorter"
      }}
      icon={ArrowUpDown}
      title="Line Sorter"
      description="Sort and deduplicate lines of text alphabetically"
      category="text"
      actions={
        <>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="rounded"
            />
            Remove Duplicates
          </label>

          <div className="h-4 w-px bg-border" />

          <Button onClick={handleSort} size="sm">Sort Lines</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >

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
    </ToolPageLayout>
  );
}
