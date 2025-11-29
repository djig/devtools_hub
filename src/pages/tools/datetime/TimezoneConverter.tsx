import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { Globe, Clock, CalendarDays } from 'lucide-react';
import { SEO } from '../../../utils/seo';

interface Timezone {
  name: string;
  offset: string;
  location: string;
}

const popularTimezones: Timezone[] = [
  { name: 'America/New_York', offset: 'UTC-5/-4', location: 'New York (EST/EDT)' },
  { name: 'America/Los_Angeles', offset: 'UTC-8/-7', location: 'Los Angeles (PST/PDT)' },
  { name: 'America/Chicago', offset: 'UTC-6/-5', location: 'Chicago (CST/CDT)' },
  { name: 'America/Denver', offset: 'UTC-7/-6', location: 'Denver (MST/MDT)' },
  { name: 'Europe/London', offset: 'UTC+0/+1', location: 'London (GMT/BST)' },
  { name: 'Europe/Paris', offset: 'UTC+1/+2', location: 'Paris (CET/CEST)' },
  { name: 'Europe/Berlin', offset: 'UTC+1/+2', location: 'Berlin (CET/CEST)' },
  { name: 'Asia/Tokyo', offset: 'UTC+9', location: 'Tokyo (JST)' },
  { name: 'Asia/Shanghai', offset: 'UTC+8', location: 'Shanghai (CST)' },
  { name: 'Asia/Dubai', offset: 'UTC+4', location: 'Dubai (GST)' },
  { name: 'Asia/Singapore', offset: 'UTC+8', location: 'Singapore (SGT)' },
  { name: 'Asia/Hong_Kong', offset: 'UTC+8', location: 'Hong Kong (HKT)' },
  { name: 'Asia/Kolkata', offset: 'UTC+5:30', location: 'India (IST)' },
  { name: 'Australia/Sydney', offset: 'UTC+10/+11', location: 'Sydney (AEST/AEDT)' },
  { name: 'Pacific/Auckland', offset: 'UTC+12/+13', location: 'Auckland (NZST/NZDT)' },
  { name: 'UTC', offset: 'UTC+0', location: 'Coordinated Universal Time' },
];

export default function TimezoneConverter() {
  const { addRecentTool } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);

  useEffect(() => {
    addRecentTool('timezone-converter');

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set initial date and time
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));

    return () => clearInterval(interval);
  }, [addRecentTool]);

  const getTimeInTimezone = (timezone: string, date?: Date): { time: string; date: string; offset: string } => {
    const targetDate = date || currentTime;

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const time = formatter.format(targetDate);
      const dateStr = dateFormatter.format(targetDate);

      // Get offset
      const offsetMinutes = getTimezoneOffset(timezone, targetDate);
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const offsetMins = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes <= 0 ? '+' : '-';
      const offset = `UTC${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins}` : ''}`;

      return { time, date: dateStr, offset };
    } catch (error) {
      return { time: 'Invalid', date: 'Invalid', offset: 'N/A' };
    }
  };

  const getTimezoneOffset = (timezone: string, date: Date): number => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000;
  };

  const handleConvertTime = () => {
    if (selectedDate && selectedTime) {
      const dateTimeStr = `${selectedDate}T${selectedTime}:00`;
      const newDate = new Date(dateTimeStr);
      if (!isNaN(newDate.getTime())) {
        setCurrentTime(newDate);
      }
    }
  };

  const addTimezone = (timezone: string) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezone: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  const setToNow = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
    setCurrentTime(now);
  };

  return (
    <>
      <SEO
        title="Timezone Converter - Convert Times Between Timezones"
        description="Convert times between different timezones online. Free timezone converter with world clock. Find meeting times across timezones easily. Supports all IANA timezones."
        keywords="timezone converter, time zone converter, world clock, convert timezone, meeting time, time converter, timezone tool, free converter"
        path="/tools/timezone-converter"
      />
      <div className="space-y-6">
      {/* Compact Header with Breadcrumb */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background p-6">
        <div className="relative z-10 space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="px-6 pt-4 pb-2">
            <Breadcrumb />
          </div>

          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Timezone Converter</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert times between timezones and view world clocks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Input */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-border bg-background"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleConvertTime}>Convert</Button>
              <Button onClick={setToNow} variant="outline">
                Now
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* World Clocks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedTimezones.map((timezone) => {
          const { time, date, offset } = getTimeInTimezone(timezone);
          const timezoneInfo = popularTimezones.find(tz => tz.name === timezone);

          return (
            <Card key={timezone} className="p-4 relative group">
              <button
                onClick={() => removeTimezone(timezone)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{timezoneInfo?.location || timezone}</h3>
                  <p className="text-xs text-muted-foreground">{offset}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold font-mono">{time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{date}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Timezone */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Add Timezone</h3>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularTimezones
            .filter(tz => !selectedTimezones.includes(tz.name))
            .map((timezone) => (
              <Button
                key={timezone.name}
                variant="outline"
                size="sm"
                onClick={() => addTimezone(timezone.name)}
                className="justify-start h-auto py-2 text-left"
              >
                <div>
                  <div className="text-xs font-medium">{timezone.location}</div>
                  <div className="text-xs text-muted-foreground">{timezone.offset}</div>
                </div>
              </Button>
            ))}
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Timezone Converter</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Select a date and time to convert across timezones</p>
          <p>• World clocks update in real-time when using "Now"</p>
          <p>• UTC offsets shown may vary due to daylight saving time</p>
          <p>• Add or remove timezones to customize your view</p>
          <p>• All conversions account for daylight saving time automatically</p>
        </div>
      </Card>
      </div>
    </>
  );
}
