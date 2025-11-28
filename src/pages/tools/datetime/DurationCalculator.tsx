import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { Clock, Calendar, Timer } from 'lucide-react';

interface Duration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export default function DurationCalculator() {
  const { addRecentTool } = useAppStore();
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('00:00');
  const [duration, setDuration] = useState<Duration | null>(null);
  const [includeTime, setIncludeTime] = useState(true);

  useEffect(() => {
    addRecentTool('duration-calculator');

    // Set initial dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().slice(0, 5));
    setEndTime(now.toTimeString().slice(0, 5));
  }, [addRecentTool]);

  const calculateDuration = () => {
    if (!startDate || !endDate) return;

    const startDateTime = includeTime
      ? new Date(`${startDate}T${startTime}:00`)
      : new Date(`${startDate}T00:00:00`);

    const endDateTime = includeTime
      ? new Date(`${endDate}T${endTime}:00`)
      : new Date(`${endDate}T23:59:59`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) return;

    const diffMs = Math.abs(endDateTime.getTime() - startDateTime.getTime());

    // Calculate total units
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate individual units
    let remaining = diffMs;
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30.44; // Average month length
    const msPerYear = msPerDay * 365.25; // Account for leap years

    const years = Math.floor(remaining / msPerYear);
    remaining -= years * msPerYear;

    const months = Math.floor(remaining / msPerMonth);
    remaining -= months * msPerMonth;

    const days = Math.floor(remaining / msPerDay);
    remaining -= days * msPerDay;

    const hours = Math.floor(remaining / msPerHour);
    remaining -= hours * msPerHour;

    const minutes = Math.floor(remaining / msPerMinute);
    remaining -= minutes * msPerMinute;

    const seconds = Math.floor(remaining / msPerSecond);

    setDuration({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    });
  };

  const setToNow = (isStart: boolean) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);

    if (isStart) {
      setStartDate(date);
      setStartTime(time);
    } else {
      setEndDate(date);
      setEndTime(time);
    }
  };

  const loadExample = (type: 'hour' | 'day' | 'week' | 'month' | 'year') => {
    const now = new Date();
    const future = new Date(now);

    switch (type) {
      case 'hour':
        future.setHours(future.getHours() + 1);
        break;
      case 'day':
        future.setDate(future.getDate() + 1);
        break;
      case 'week':
        future.setDate(future.getDate() + 7);
        break;
      case 'month':
        future.setMonth(future.getMonth() + 1);
        break;
      case 'year':
        future.setFullYear(future.getFullYear() + 1);
        break;
    }

    setStartDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().slice(0, 5));
    setEndDate(future.toISOString().split('T')[0]);
    setEndTime(future.toTimeString().slice(0, 5));
    setIncludeTime(true);
  };

  useEffect(() => {
    if (startDate && endDate) {
      calculateDuration();
    }
  }, [startDate, startTime, endDate, endTime, includeTime]);

  const formatDurationText = (dur: Duration): string => {
    const parts: string[] = [];

    if (dur.years > 0) parts.push(`${dur.years} year${dur.years !== 1 ? 's' : ''}`);
    if (dur.months > 0) parts.push(`${dur.months} month${dur.months !== 1 ? 's' : ''}`);
    if (dur.days > 0) parts.push(`${dur.days} day${dur.days !== 1 ? 's' : ''}`);
    if (includeTime && dur.hours > 0) parts.push(`${dur.hours} hour${dur.hours !== 1 ? 's' : ''}`);
    if (includeTime && dur.minutes > 0) parts.push(`${dur.minutes} minute${dur.minutes !== 1 ? 's' : ''}`);
    if (includeTime && dur.seconds > 0) parts.push(`${dur.seconds} second${dur.seconds !== 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 seconds';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Duration Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the time duration between two dates and times
        </p>
      </div>

      {/* Quick Examples */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Examples</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => loadExample('hour')} variant="outline" size="sm">
            1 Hour
          </Button>
          <Button onClick={() => loadExample('day')} variant="outline" size="sm">
            1 Day
          </Button>
          <Button onClick={() => loadExample('week')} variant="outline" size="sm">
            1 Week
          </Button>
          <Button onClick={() => loadExample('month')} variant="outline" size="sm">
            1 Month
          </Button>
          <Button onClick={() => loadExample('year')} variant="outline" size="sm">
            1 Year
          </Button>
        </div>
      </Card>

      {/* Date/Time Inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Start Date/Time */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Start Date & Time</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
              />
            </div>
            {includeTime && (
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
                />
              </div>
            )}
            <Button onClick={() => setToNow(true)} variant="outline" size="sm" className="w-full">
              Set to Now
            </Button>
          </div>
        </Card>

        {/* End Date/Time */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">End Date & Time</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
              />
            </div>
            {includeTime && (
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
                />
              </div>
            )}
            <Button onClick={() => setToNow(false)} variant="outline" size="sm" className="w-full">
              Set to Now
            </Button>
          </div>
        </Card>
      </div>

      {/* Options */}
      <Card className="p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTime}
            onChange={(e) => setIncludeTime(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm font-medium">Include time in calculation</span>
        </label>
      </Card>

      {/* Duration Results */}
      {duration && (
        <>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Timer className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Duration</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">{formatDurationText(duration)}</p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">Total Days</h4>
              </div>
              <p className="text-2xl font-bold">{duration.totalDays.toLocaleString()}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">Total Hours</h4>
              </div>
              <p className="text-2xl font-bold">{duration.totalHours.toLocaleString()}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">Total Minutes</h4>
              </div>
              <p className="text-2xl font-bold">{duration.totalMinutes.toLocaleString()}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">Total Seconds</h4>
              </div>
              <p className="text-2xl font-bold">{duration.totalSeconds.toLocaleString()}</p>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Breakdown</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{duration.years}</div>
                <div className="text-xs text-muted-foreground mt-1">Years</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{duration.months}</div>
                <div className="text-xs text-muted-foreground mt-1">Months</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{duration.days}</div>
                <div className="text-xs text-muted-foreground mt-1">Days</div>
              </div>
              {includeTime && (
                <>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{duration.hours}</div>
                    <div className="text-xs text-muted-foreground mt-1">Hours</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{duration.minutes}</div>
                    <div className="text-xs text-muted-foreground mt-1">Minutes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{duration.seconds}</div>
                    <div className="text-xs text-muted-foreground mt-1">Seconds</div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Duration Calculator</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Calculate the exact duration between any two dates and times</p>
          <p>• Toggle time inclusion to calculate date-only durations</p>
          <p>• View total duration in days, hours, minutes, and seconds</p>
          <p>• Month calculations use average month length (30.44 days)</p>
          <p>• Year calculations account for leap years (365.25 days)</p>
        </div>
      </Card>
    </div>
  );
}
