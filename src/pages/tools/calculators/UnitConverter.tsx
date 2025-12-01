import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { convertUnit, UNIT_CATEGORIES } from '../../../utils/converters/units';
import type { UnitCategory } from '../../../utils/converters/units';
import { Ruler } from 'lucide-react';

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('unit-converter');
  }, [addRecentTool]);

  useEffect(() => {
    // Reset units when category changes
    const units = Object.keys(UNIT_CATEGORIES[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setOutputValue('');
      return;
    }

    try {
      const result = convertUnit(
        Number(inputValue),
        fromUnit,
        toUnit,
        category
      );
      setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } catch (error) {
      setOutputValue('Error');
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const currentUnits = UNIT_CATEGORIES[category].units;
  const unitKeys = Object.keys(currentUnits);

  return (
    <ToolPageLayout
      seo={{
        title: "Unit Converter - Convert Length, Weight, Temperature, Data Size",
        description: "Convert units online: length, weight, temperature, data size, and more. Free unit converter with support for metric, imperial, and other unit systems. Accurate and instant.",
        keywords: "unit converter, convert units, length converter, weight converter, temperature converter, data size converter, metric converter, free converter",
        path: "/tools/unit-converter"
      }}
      icon={Ruler}
      title="Unit Converter"
      description="Convert between different units of measurement"
      category="calculators"
    >
      <Card className="p-4">
        <label className="text-sm font-medium mb-2 block">Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              {UNIT_CATEGORIES[cat].name}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">From</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                {unitKeys.map((key) => (
                  <option key={key} value={key}>
                    {currentUnits[key].name} ({currentUnits[key].symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Value</label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">To</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Unit</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                {unitKeys.map((key) => (
                  <option key={key} value={key}>
                    {currentUnits[key].name} ({currentUnits[key].symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Result</label>
              <div className="w-full px-3 py-2 rounded-md border border-border bg-muted/50 text-sm min-h-[40px] flex items-center font-semibold">
                {outputValue || '-'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {outputValue && !isNaN(Number(outputValue)) && (
        <Card className="p-4 bg-muted/50">
          <div className="text-center">
            <p className="text-lg">
              <span className="font-bold">{inputValue}</span>{' '}
              <span className="text-muted-foreground">
                {currentUnits[fromUnit].symbol}
              </span>{' '}
              ={' '}
              <span className="font-bold">{outputValue}</span>{' '}
              <span className="text-muted-foreground">
                {currentUnits[toUnit].symbol}
              </span>
            </p>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-2">Available Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((cat) => (
            <div key={cat}>
              <p className="font-semibold">{UNIT_CATEGORIES[cat].name}</p>
              <p className="text-muted-foreground">
                {Object.keys(UNIT_CATEGORIES[cat].units).length} units available
              </p>
            </div>
          ))}
        </div>
      </Card>
    </ToolPageLayout>
  );
}
