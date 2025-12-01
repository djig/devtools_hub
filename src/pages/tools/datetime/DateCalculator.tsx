import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { addDays, addMonths, addYears, differenceInDays, format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';

type Operation = 'add' | 'subtract' | 'difference';
type Unit = 'days' | 'months' | 'years';

export default function DateCalculator() {
  const [operation, setOperation] = useState<Operation>('add');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState<Unit>('days');
  const [result, setResult] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('date-calculator');
  }, [addRecentTool]);

  const handleCalculate = () => {
    try {
      const start = parseISO(startDate);
      const amount = Number(value);

      if (isNaN(amount)) {
        setResult('Invalid number');
        return;
      }

      if (operation === 'difference') {
        const end = parseISO(endDate);
        const days = differenceInDays(end, start);
        setResult(`${Math.abs(days)} days (${(Math.abs(days) / 365).toFixed(2)} years)`);
        return;
      }

      const multiplier = operation === 'subtract' ? -1 : 1;
      const actualAmount = amount * multiplier;

      let resultDate: Date;
      if (unit === 'days') {
        resultDate = addDays(start, actualAmount);
      } else if (unit === 'months') {
        resultDate = addMonths(start, actualAmount);
      } else {
        resultDate = addYears(start, actualAmount);
      }

      setResult(format(resultDate, 'PPPP'));
    } catch (error) {
      setResult('Error calculating date');
    }
  };

  const setToday = () => {
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Date Calculator - Add or Subtract Days, Months, Years from Dates",
        description: "Add or subtract days, months, and years from dates online. Free date calculator for date arithmetic. Calculate future and past dates, find date differences.",
        keywords: "date calculator, add days to date, subtract days, date math, calculate date, date difference, days calculator, free calculator",
        path: "/tools/date-calculator"
      }}
      icon={Calendar}
      title="Date Calculator"
      description="Add, subtract, or calculate the difference between dates"
      category="datetime"
    >
      <Card className="p-4">
        <label className="text-sm font-medium mb-2 block">Operation</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'add' as const, label: 'Add' },
            { value: 'subtract' as const, label: 'Subtract' },
            { value: 'difference' as const, label: 'Difference' },
          ].map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                operation === op.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {operation === 'difference' ? 'Start Date' : 'Date'}
            </label>
            <Button onClick={setToday} variant="ghost" size="sm">
              Today
            </Button>
          </div>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {operation === 'difference' ? (
          <div>
            <label className="text-sm font-medium mb-2 block">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {operation === 'add' ? 'Add' : 'Subtract'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter amount..."
                  className="flex-1"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  className="px-3 py-2 rounded-md border border-border bg-background text-sm min-w-[120px]"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </>
        )}

        <Button onClick={handleCalculate} className="w-full">
          Calculate
        </Button>
      </Card>

      {result && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Result
          </h3>
          <p className="text-2xl font-bold">{result}</p>
        </Card>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-2">Examples</h3>
        <div className="space-y-2 text-xs">
          <p className="text-muted-foreground">
            <span className="font-semibold">Add:</span> Calculate future dates (e.g., add 30 days from today)
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold">Subtract:</span> Calculate past dates (e.g., subtract 6 months)
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold">Difference:</span> Calculate days between two dates
          </p>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
