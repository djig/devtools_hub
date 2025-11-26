import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { convertBase } from '../../../utils/converters/numberBase';

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Number Base Converter</h1>
        <p className="text-muted-foreground">
          Convert between Binary, Decimal, Octal, and Hexadecimal
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Input Number</label>
              <Input
                placeholder="Enter number..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Input Base</label>
              <select
                value={fromBase}
                onChange={(e) => setFromBase(Number(e.target.value))}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value={2}>Binary (Base 2)</option>
                <option value={8}>Octal (Base 8)</option>
                <option value={10}>Decimal (Base 10)</option>
                <option value={16}>Hexadecimal (Base 16)</option>
              </select>
            </div>
          </div>

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
