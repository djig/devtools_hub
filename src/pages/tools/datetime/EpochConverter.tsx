import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EpochConverter() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [epochInput, setEpochInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedEpoch, setConvertedEpoch] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('epoch-converter');

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [addRecentTool]);

  const epochToDate = () => {
    try {
      const epoch = Number(epochInput);
      const timestamp = epochInput.length === 10 ? epoch * 1000 : epoch;
      const date = new Date(timestamp);

      if (isNaN(date.getTime())) {
        setConvertedDate('Invalid epoch timestamp');
        return;
      }

      const formatted = [
        `ISO 8601: ${date.toISOString()}`,
        `UTC: ${date.toUTCString()}`,
        `Local: ${date.toLocaleString()}`,
        `Date: ${format(date, 'MMMM dd, yyyy')}`,
        `Time: ${format(date, 'HH:mm:ss')}`,
      ].join('\n');

      setConvertedDate(formatted);
    } catch (error) {
      setConvertedDate('Error converting epoch');
    }
  };

  const dateToEpoch = () => {
    try {
      const date = new Date(dateInput);

      if (isNaN(date.getTime())) {
        setConvertedEpoch('Invalid date format');
        return;
      }

      const epochMs = date.getTime();
      const epochS = Math.floor(epochMs / 1000);

      const formatted = [
        `Milliseconds: ${epochMs}`,
        `Seconds: ${epochS}`,
      ].join('\n');

      setConvertedEpoch(formatted);
    } catch (error) {
      setConvertedEpoch('Error converting date');
    }
  };

  const useCurrentTime = () => {
    setEpochInput(Math.floor(Date.now() / 1000).toString());
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Epoch Converter - Unix Timestamp Converter",
        description: "Convert between Unix timestamps and dates online. Free epoch converter that transforms Unix time to human-readable dates and vice versa. Supports milliseconds and seconds.",
        keywords: "epoch converter, unix timestamp, timestamp converter, epoch to date, unix time converter, timestamp tool, epoch time, free converter",
        path: "/tools/epoch-converter"
      }}
      icon={Clock}
      title="Epoch Converter"
      description="Convert between Unix timestamps and human-readable dates"
      category="datetime"
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Current Unix Timestamp</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-mono font-bold text-primary">
              {Math.floor(currentTime / 1000)}
            </span>
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-mono font-semibold text-muted-foreground">
              {currentTime}
            </span>
            <span className="text-sm text-muted-foreground">milliseconds</span>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {new Date(currentTime).toLocaleString()}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Epoch to Date</h3>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="1609459200"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                className="font-mono"
              />
              <Button onClick={useCurrentTime} variant="outline">
                Now
              </Button>
            </div>
          </div>

          <Button onClick={epochToDate} className="w-full">
            Convert to Date
          </Button>

          {convertedDate && (
            <pre className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
              {convertedDate}
            </pre>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Date to Epoch</h3>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Date (ISO format or natural language)
            </label>
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>

          <Button onClick={dateToEpoch} className="w-full">
            Convert to Epoch
          </Button>

          {convertedEpoch && (
            <pre className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
              {convertedEpoch}
            </pre>
          )}
        </Card>
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Unix Timestamp</h3>
        <p className="text-sm text-muted-foreground">
          Unix timestamp (also known as Epoch time) is the number of seconds that have elapsed
          since January 1, 1970 (midnight UTC). It's widely used in programming and systems to
          represent dates and times.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
