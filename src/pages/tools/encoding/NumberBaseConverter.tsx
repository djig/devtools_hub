import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { convertBase } from '../../../utils/converters/numberBase';
import { Binary } from 'lucide-react';

export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('number-base-converter');
  }, [addRecentTool]);

  useEffect(() => {
    if (input.trim()) {
      try {
        const converted = convertBase(input, fromBase);
        setResults(converted);
        setError('');
      } catch (err) {
        setError((err as Error).message);
        setResults(null);
      }
    } else {
      setResults(null);
      setError('');
    }
  }, [input, fromBase]);

  const conversions = results
    ? [
        { label: 'Decimal (Base 10)', value: results.decimal },
        { label: 'Binary (Base 2)', value: results.binary },
        { label: 'Octal (Base 8)', value: results.octal },
        { label: 'Hexadecimal (Base 16)', value: results.hex },
      ]
    : [];

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
                <Binary className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Number Base Converter</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Convert between Binary, Decimal, Octal, and Hexadecimal
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Input:</label>
                <Input
                  placeholder="Enter number..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono h-9 text-sm w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Base:</label>
                <select
                  value={fromBase}
                  onChange={(e) => setFromBase(Number(e.target.value))}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value={2}>Binary (2)</option>
                  <option value={8}>Octal (8)</option>
                  <option value={10}>Decimal (10)</option>
                  <option value={16}>Hex (16)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </div>
      </Card>

      {conversions.length > 0 && (
        <div className="space-y-4">
          {conversions.map((conversion) => (
            <Card key={conversion.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {conversion.label}
                </h3>
                <CopyButton text={conversion.value} />
              </div>
              <div className="p-3 rounded bg-muted/50 break-all font-mono text-lg">
                {conversion.value}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!results && !error && (
        <Card className="p-8 text-center text-muted-foreground">
          Enter a number above to see conversions
        </Card>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">Examples</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Decimal: 255 → Binary: 11111111, Hex: FF</p>
          <p>• Binary: 1010 → Decimal: 10, Hex: A</p>
          <p>• Hex: FF → Decimal: 255, Binary: 11111111</p>
        </div>
      </Card>
    </div>
  );
}
