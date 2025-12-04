import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { Calculator, Percent } from 'lucide-react';

export default function PercentageCalculator() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [percentage, setPercentage] = useState('');
  const [results, setResults] = useState<any>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('percentage-calculator');
  }, [addRecentTool]);

  const calculatePercentage = () => {
    const v1 = Number(value1);
    const v2 = Number(value2);

    if (isNaN(v1) || isNaN(v2)) return;

    const percentageValue = (v1 / v2) * 100;
    const difference = v2 - v1;
    const percentChange = ((v2 - v1) / v1) * 100;

    setResults({
      percentage: percentageValue.toFixed(2),
      difference: difference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
  };

  const calculateOfPercentage = () => {
    const pct = Number(percentage);
    const val = Number(value1);

    if (isNaN(pct) || isNaN(val)) return;

    const result = (pct / 100) * val;

    setResults({
      result: result.toFixed(2),
      calculation: `${pct}% of ${val} = ${result.toFixed(2)}`,
    });
  };

  const calculateIncrease = () => {
    const val = Number(value1);
    const pct = Number(percentage);

    if (isNaN(val) || isNaN(pct)) return;

    const increase = (pct / 100) * val;
    const result = val + increase;

    setResults({
      increase: increase.toFixed(2),
      result: result.toFixed(2),
      calculation: `${val} + ${pct}% = ${result.toFixed(2)}`,
    });
  };

  const calculateDecrease = () => {
    const val = Number(value1);
    const pct = Number(percentage);

    if (isNaN(val) || isNaN(pct)) return;

    const decrease = (pct / 100) * val;
    const result = val - decrease;

    setResults({
      decrease: decrease.toFixed(2),
      result: result.toFixed(2),
      calculation: `${val} - ${pct}% = ${result.toFixed(2)}`,
    });
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Percentage Calculator - Calculate Percentages, Increase, Decrease",
        description: "Calculate percentages, percentage increase, and percentage decrease online. Free percentage calculator for business, finance, and everyday math. Multiple calculation modes.",
        keywords: "percentage calculator, percent calculator, calculate percentage, percentage increase, percentage decrease, percent change, free calculator, percentage calculators online, free percentage calculator, percentage tool online, percentage finder",
        path: "/tools/percentage-calculator"
      }}
      icon={Percent}
      title="Percentage Calculator"
      description="Calculate percentages, increases, decreases, and more"
      category="calculators"
    >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              What % is X of Y?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Value (X)</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Total (Y)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculatePercentage} className="w-full">
              Calculate
            </Button>
            {results?.percentage && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{results.percentage}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {value1} is {results.percentage}% of {value2}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              What is X% of Y?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Percentage (%)</label>
                <Input
                  type="number"
                  placeholder="15"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Value</label>
                <Input
                  type="number"
                  placeholder="200"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculateOfPercentage} className="w-full">
              Calculate
            </Button>
            {results?.calculation && !results.increase && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{results.result}</p>
                <p className="text-sm text-muted-foreground mt-1">{results.calculation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Increase by X%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Value</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Increase (%)</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculateIncrease} className="w-full">
              Calculate
            </Button>
            {results?.increase && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{results.result}</p>
                <p className="text-sm text-muted-foreground mt-1">{results.calculation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Decrease by X%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Value</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Decrease (%)</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculateDecrease} className="w-full">
              Calculate
            </Button>
            {results?.decrease && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{results.result}</p>
                <p className="text-sm text-muted-foreground mt-1">{results.calculation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
