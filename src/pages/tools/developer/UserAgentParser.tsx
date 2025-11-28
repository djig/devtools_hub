import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Monitor as MonitorIcon, Smartphone, Tablet, Globe, Cpu, Code, Monitor } from 'lucide-react';

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
}

export default function UserAgentParser() {
  const [userAgent, setUserAgent] = useState('');
  const [parsed, setParsed] = useState<ParsedUA | null>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('user-agent-parser');
  }, [addRecentTool]);

  const parseUserAgent = (ua: string): ParsedUA => {
    const result: ParsedUA = {
      browser: { name: 'Unknown', version: '' },
      os: { name: 'Unknown', version: '' },
      device: { type: 'Desktop', vendor: '', model: '' },
      engine: { name: 'Unknown', version: '' },
    };

    if (!ua) return result;

    // Detect Browser
    if (ua.includes('Firefox/')) {
      result.browser.name = 'Firefox';
      result.browser.version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Edg/')) {
      result.browser.name = 'Edge';
      result.browser.version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Chrome/')) {
      result.browser.name = 'Chrome';
      result.browser.version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      result.browser.name = 'Safari';
      result.browser.version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
      result.browser.name = 'Opera';
      result.browser.version = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || '';
    }

    // Detect OS
    if (ua.includes('Windows NT')) {
      result.os.name = 'Windows';
      const version = ua.match(/Windows NT ([\d.]+)/)?.[1];
      if (version === '10.0') result.os.version = '10';
      else if (version === '6.3') result.os.version = '8.1';
      else if (version === '6.2') result.os.version = '8';
      else if (version === '6.1') result.os.version = '7';
      else result.os.version = version || '';
    } else if (ua.includes('Mac OS X')) {
      result.os.name = 'macOS';
      result.os.version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (ua.includes('Android')) {
      result.os.name = 'Android';
      result.os.version = ua.match(/Android ([\d.]+)/)?.[1] || '';
    } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
      result.os.name = 'iOS';
      result.os.version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (ua.includes('Linux')) {
      result.os.name = 'Linux';
    }

    // Detect Device Type
    if (ua.includes('Mobile') || ua.includes('Android')) {
      result.device.type = 'Mobile';
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
      result.device.type = 'Tablet';
    }

    // Detect Device Details
    if (ua.includes('iPhone')) {
      result.device.vendor = 'Apple';
      result.device.model = 'iPhone';
    } else if (ua.includes('iPad')) {
      result.device.vendor = 'Apple';
      result.device.model = 'iPad';
    } else if (ua.includes('Samsung')) {
      result.device.vendor = 'Samsung';
    } else if (ua.includes('Pixel')) {
      result.device.vendor = 'Google';
      result.device.model = ua.match(/(Pixel [\w\s]+)/)?.[1] || 'Pixel';
    }

    // Detect Engine
    if (ua.includes('Gecko/')) {
      result.engine.name = 'Gecko';
      result.engine.version = ua.match(/rv:([\d.]+)/)?.[1] || '';
    } else if (ua.includes('AppleWebKit/')) {
      result.engine.name = 'WebKit';
      result.engine.version = ua.match(/AppleWebKit\/([\d.]+)/)?.[1] || '';
      if (ua.includes('Chrome/')) {
        result.engine.name = 'Blink';
      }
    } else if (ua.includes('Trident/')) {
      result.engine.name = 'Trident';
      result.engine.version = ua.match(/Trident\/([\d.]+)/)?.[1] || '';
    }

    return result;
  };

  const handleParse = () => {
    const result = parseUserAgent(userAgent);
    setParsed(result);
  };

  const detectCurrentUA = () => {
    const currentUA = navigator.userAgent;
    setUserAgent(currentUA);
    setParsed(parseUserAgent(currentUA));
  };

  const loadSample = (sample: string) => {
    setUserAgent(sample);
    setParsed(parseUserAgent(sample));
  };

  const samples = [
    {
      name: 'Chrome on Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    {
      name: 'Safari on iPhone',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    },
    {
      name: 'Firefox on macOS',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    },
  ];

  const getDeviceIcon = (type: string) => {
    if (type === 'Mobile') return Smartphone;
    if (type === 'Tablet') return Tablet;
    return MonitorIcon;
  };

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
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">User Agent Parser</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Parse and analyze HTTP User-Agent strings to extract browser, OS, and device information
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={detectCurrentUA} size="sm">
                Detect My User Agent
              </Button>
              <Button onClick={handleParse} variant="outline" size="sm">
                Parse
              </Button>
              {samples.map((sample) => (
                <Button
                  key={sample.name}
                  onClick={() => loadSample(sample.ua)}
                  variant="ghost"
                  size="sm"
                >
                  {sample.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <Textarea
          placeholder="Paste a User-Agent string here..."
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
        />
      </Card>

      {parsed && (
        <>
          {/* Browser Info */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Browser</h3>
                  <p className="text-sm text-muted-foreground">Web browser details</p>
                </div>
              </div>
              <CopyButton text={`${parsed.browser.name} ${parsed.browser.version}`} />
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Name</div>
                <div className="text-xl font-bold">{parsed.browser.name}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Version</div>
                <div className="text-xl font-bold">{parsed.browser.version || 'N/A'}</div>
              </div>
            </div>
          </Card>

          {/* Operating System */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Operating System</h3>
                  <p className="text-sm text-muted-foreground">Platform information</p>
                </div>
              </div>
              <CopyButton text={`${parsed.os.name} ${parsed.os.version}`} />
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Name</div>
                <div className="text-xl font-bold">{parsed.os.name}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Version</div>
                <div className="text-xl font-bold">{parsed.os.version || 'N/A'}</div>
              </div>
            </div>
          </Card>

          {/* Device Info */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                  {(() => {
                    const Icon = getDeviceIcon(parsed.device.type);
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Device</h3>
                  <p className="text-sm text-muted-foreground">Hardware information</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="text-lg font-bold">{parsed.device.type}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Vendor</div>
                <div className="text-lg font-bold">{parsed.device.vendor || 'N/A'}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Model</div>
                <div className="text-lg font-bold">{parsed.device.model || 'N/A'}</div>
              </div>
            </div>
          </Card>

          {/* Engine Info */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Rendering Engine</h3>
                  <p className="text-sm text-muted-foreground">Browser engine details</p>
                </div>
              </div>
              <CopyButton text={`${parsed.engine.name} ${parsed.engine.version}`} />
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Engine</div>
                <div className="text-xl font-bold">{parsed.engine.name}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Version</div>
                <div className="text-xl font-bold">{parsed.engine.version || 'N/A'}</div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
