import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, Clock, Calendar, Info } from 'lucide-react';

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export default function CronParser() {
  const [cronExpression, setCronExpression] = useState('*/5 * * * *');
  const [cronParts, setCronParts] = useState<CronParts>({
    minute: '*/5',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  });
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('cron-parser');
     
    parseCronExpression(cronExpression);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addRecentTool]);

  const describeCron = (parts: CronParts): string => {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

    let desc = 'Run ';

    // Minute
    if (minute === '*') {
      desc += 'every minute';
    } else if (minute.includes('/')) {
      const step = minute.split('/')[1];
      desc += `every ${step} minute${step !== '1' ? 's' : ''}`;
    } else if (minute.includes(',')) {
      desc += `at minute ${minute}`;
    } else {
      desc += `at minute ${minute}`;
    }

    // Hour
    if (hour !== '*') {
      if (hour.includes('/')) {
        const step = hour.split('/')[1];
        desc += ` of every ${step} hour${step !== '1' ? 's' : ''}`;
      } else if (hour.includes(',')) {
        desc += ` past hour ${hour}`;
      } else {
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        desc += ` at ${displayHour}:00 ${ampm}`;
      }
    }

    // Day of month
    if (dayOfMonth !== '*') {
      if (dayOfMonth.includes('/')) {
        const step = dayOfMonth.split('/')[1];
        desc += ` every ${step} days`;
      } else if (dayOfMonth.includes(',')) {
        desc += ` on day ${dayOfMonth} of the month`;
      } else {
        desc += ` on day ${dayOfMonth} of the month`;
      }
    }

    // Month
    if (month !== '*') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (month.includes(',')) {
        const months = month.split(',').map(m => monthNames[parseInt(m) - 1]).join(', ');
        desc += ` in ${months}`;
      } else {
        desc += ` in ${monthNames[parseInt(month) - 1]}`;
      }
    }

    // Day of week
    if (dayOfWeek !== '*') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (dayOfWeek.includes(',')) {
        const days = dayOfWeek.split(',').map(d => dayNames[parseInt(d)]).join(', ');
        desc += ` on ${days}`;
      } else if (dayOfWeek.includes('-')) {
        const [start, end] = dayOfWeek.split('-');
        desc += ` from ${dayNames[parseInt(start)]} through ${dayNames[parseInt(end)]}`;
      } else {
        desc += ` on ${dayNames[parseInt(dayOfWeek)]}`;
      }
    }

    return desc;
  };

  const calculateNextRuns = (parts: CronParts, count: number = 5): Date[] => {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;
    const runs: Date[] = [];
    const now = new Date();
    let current = new Date(now);
    current.setSeconds(0);
    current.setMilliseconds(0);

    // Simple next run calculation (not fully accurate for all cases)
    for (let i = 0; i < count * 100 && runs.length < count; i++) {
      current = new Date(current.getTime() + 60000); // Add 1 minute

      const matches =
        (minute === '*' || minute === current.getMinutes().toString() ||
         (minute.includes('/') && current.getMinutes() % parseInt(minute.split('/')[1]) === 0) ||
         (minute.includes(',') && minute.split(',').includes(current.getMinutes().toString()))) &&
        (hour === '*' || hour === current.getHours().toString() ||
         (hour.includes('/') && current.getHours() % parseInt(hour.split('/')[1]) === 0) ||
         (hour.includes(',') && hour.split(',').includes(current.getHours().toString()))) &&
        (dayOfMonth === '*' || dayOfMonth === current.getDate().toString() ||
         (dayOfMonth.includes(',') && dayOfMonth.split(',').includes(current.getDate().toString()))) &&
        (month === '*' || month === (current.getMonth() + 1).toString() ||
         (month.includes(',') && month.split(',').includes((current.getMonth() + 1).toString()))) &&
        (dayOfWeek === '*' || dayOfWeek === current.getDay().toString() ||
         (dayOfWeek.includes(',') && dayOfWeek.split(',').includes(current.getDay().toString())));

      if (matches) {
        runs.push(new Date(current));
      }
    }

    return runs;
  };

  const parseCronExpression = (expr: string) => {
    try {
      const parts = expr.trim().split(/\s+/);

      if (parts.length !== 5) {
        setError('Invalid cron expression. Must have exactly 5 fields: minute hour day month weekday');
        setDescription('');
        setNextRuns([]);
        return;
      }

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

      // Basic validation
      const isValidField = (field: string) => {
        return /^[\d*,/-]+$/.test(field);
      };

      if (!parts.every(isValidField)) {
        setError('Invalid characters in cron expression');
        setDescription('');
        setNextRuns([]);
        return;
      }

      const newParts: CronParts = { minute, hour, dayOfMonth, month, dayOfWeek };
      setCronParts(newParts);

      const desc = describeCron(newParts);
      setDescription(desc);

      const runs = calculateNextRuns(newParts, 5);
      setNextRuns(runs);

      setError('');
    } catch {
      setError('Failed to parse cron expression');
      setDescription('');
      setNextRuns([]);
    }
  };

  const handleParse = () => {
    parseCronExpression(cronExpression);
  };

  const handlePartChange = (field: keyof CronParts, value: string) => {
    const newParts = { ...cronParts, [field]: value };
    setCronParts(newParts);
    const newExpr = `${newParts.minute} ${newParts.hour} ${newParts.dayOfMonth} ${newParts.month} ${newParts.dayOfWeek}`;
    setCronExpression(newExpr);
    parseCronExpression(newExpr);
  };

  const loadExample = (expr: string) => {
    setCronExpression(expr);
    parseCronExpression(expr);
  };

  const examples = [
    { expr: '*/5 * * * *', desc: 'Every 5 minutes' },
    { expr: '0 * * * *', desc: 'Every hour' },
    { expr: '0 0 * * *', desc: 'Daily at midnight' },
    { expr: '0 9 * * 1-5', desc: '9 AM on weekdays' },
    { expr: '0 0 1 * *', desc: 'First day of month' },
    { expr: '*/15 9-17 * * 1-5', desc: 'Every 15 min, 9AM-5PM, weekdays' },
  ];

  return (
    <ToolPageLayout
      seo={{
        title: "Cron Expression Parser - Build and Parse Cron Schedules",
        description: "Parse and build cron expressions online. Free cron parser with visual preview of schedule execution times. Perfect for scheduling tasks and jobs.",
        keywords: "cron parser, cron expression, cron builder, parse cron, cron schedule, cron generator, cron tool, free cron parser",
        path: "/tools/cron-parser"
      }}
      icon={Clock}
      title="Cron Expression Parser"
      description="Parse and build cron expressions with human-readable descriptions"
      category="developer"
    >

      {/* Expression Input */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="* * * * *"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleParse()}
              className="flex-1 font-mono"
            />
            <Button onClick={handleParse}>Parse</Button>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Format: minute hour day month weekday
          </div>
        </div>
      </Card>

      {/* Field Editors */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Build Cron Expression</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Minute (0-59)</label>
            <Input
              placeholder="*"
              value={cronParts.minute}
              onChange={(e) => handlePartChange('minute', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hour (0-23)</label>
            <Input
              placeholder="*"
              value={cronParts.hour}
              onChange={(e) => handlePartChange('hour', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Day (1-31)</label>
            <Input
              placeholder="*"
              value={cronParts.dayOfMonth}
              onChange={(e) => handlePartChange('dayOfMonth', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Month (1-12)</label>
            <Input
              placeholder="*"
              value={cronParts.month}
              onChange={(e) => handlePartChange('month', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weekday (0-6)</label>
            <Input
              placeholder="*"
              value={cronParts.dayOfWeek}
              onChange={(e) => handlePartChange('dayOfWeek', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/10">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Description */}
      {description && !error && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary mb-1">Schedule</p>
              <p className="text-foreground">{description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Next Runs */}
      {nextRuns.length > 0 && !error && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Next 5 Executions</h3>
          </div>
          <div className="space-y-2">
            {nextRuns.map((run, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">Run {idx + 1}</span>
                <code className="font-mono text-sm">{run.toLocaleString()}</code>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Examples */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Common Examples</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {examples.map((example, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start h-auto py-3 px-4"
              onClick={() => loadExample(example.expr)}
            >
              <div className="text-left">
                <div className="font-mono text-xs mb-1">{example.expr}</div>
                <div className="text-xs text-muted-foreground">{example.desc}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Help */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Cron Expression Format
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <code className="px-1 py-0.5 rounded bg-muted">*</code> - Any value (wildcard)</p>
          <p>• <code className="px-1 py-0.5 rounded bg-muted">*/5</code> - Every 5 units (e.g., */5 in minute = every 5 minutes)</p>
          <p>• <code className="px-1 py-0.5 rounded bg-muted">1-5</code> - Range (e.g., 1-5 in weekday = Monday through Friday)</p>
          <p>• <code className="px-1 py-0.5 rounded bg-muted">1,3,5</code> - List (e.g., 1,3,5 in month = Jan, Mar, May)</p>
          <p>• Weekday: 0 = Sunday, 1 = Monday, ... 6 = Saturday</p>
          <p>• Month: 1 = January, 2 = February, ... 12 = December</p>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
