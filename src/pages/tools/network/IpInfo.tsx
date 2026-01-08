import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, Globe, MapPin, Clock, Network as NetworkIcon } from 'lucide-react';

interface IpData {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export default function IpInfo() {
  const [ipAddress, setIpAddress] = useState('');
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [myIp, setMyIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('ip-info');
    // Get user's own IP
    fetchMyIp();
  }, [addRecentTool]);

  const fetchMyIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setMyIp(data.ip);
    } catch (err) {
      console.error('Failed to fetch your IP:', err);
    }
  };

  const validateIp = (ip: string): boolean => {
    // IPv4 validation
    const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    // IPv6 validation (basic)
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const handleLookup = async () => {
    const ip = ipAddress.trim();

    if (!ip) {
      setError('Please enter an IP address');
      return;
    }

    if (!validateIp(ip)) {
      setError('Invalid IP address format');
      return;
    }

    setLoading(true);
    setError('');
    setIpData(null);

    try {
      // Using ipinfo.io free API (limited to 50k requests/month)
      const response = await fetch(`https://ipinfo.io/${ip}/json`);

      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }

      const data = await response.json();

      if (data.bogon) {
        setError('This is a private/reserved IP address and has no public geolocation data');
        setIpData(null);
      } else {
        setIpData(data);
        setError('');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch IP information');
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  const lookupMyIp = () => {
    setIpAddress(myIp);
  };

  const loadSample = () => {
    setIpAddress('8.8.8.8');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "IP Address Info - Get Information About IP Addresses",
        description: "Get information about IP addresses online. Free IP lookup tool that shows geolocation, ISP, and network details. Check your own IP or look up any IP address.",
        keywords: "ip address info, ip lookup, my ip address, ip geolocation, ip location, what is my ip, ip info tool, free ip lookup",
        path: "/tools/ip-info"
      }}
      icon={Globe}
      title="IP Address Info"
      description="Get geolocation and network information about any IP address"
      category="network"
    >
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button onClick={handleLookup} disabled={loading}>
                {loading ? 'Looking up...' : 'Lookup'}
              </Button>
              <Button onClick={loadSample} variant="outline" size="sm">
                Sample
              </Button>
            </div>
          </div>

          {myIp && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Your IP:</span>
              <code className="px-2 py-1 rounded bg-muted font-mono">{myIp}</code>
              <Button onClick={lookupMyIp} variant="ghost" size="sm">
                Lookup My IP
              </Button>
            </div>
          )}
        </div>
      </Card>

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

      {ipData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <NetworkIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Network Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">IP Address:</span>
                <code className="font-mono font-semibold">{ipData.ip}</code>
              </div>
              {ipData.hostname && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Hostname:</span>
                  <code className="font-mono text-xs">{ipData.hostname}</code>
                </div>
              )}
              {ipData.org && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Organization:</span>
                  <span className="text-right">{ipData.org}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Location Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              {ipData.city && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{ipData.city}</span>
                </div>
              )}
              {ipData.region && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{ipData.region}</span>
                </div>
              )}
              {ipData.country && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Country:</span>
                  <span className="font-medium">{ipData.country}</span>
                </div>
              )}
              {ipData.postal && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Postal Code:</span>
                  <span className="font-medium">{ipData.postal}</span>
                </div>
              )}
            </div>
          </Card>

          {ipData.loc && (
            <Card className="p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Coordinates</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Latitude, Longitude:</span>
                  <code className="font-mono">{ipData.loc}</code>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${ipData.loc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                </a>
              </div>
            </Card>
          )}

          {ipData.timezone && (
            <Card className="p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Timezone</h3>
              </div>
              <div className="text-sm py-2">
                <span className="font-mono font-medium">{ipData.timezone}</span>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          About IP Lookup
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• This tool uses the ipinfo.io API to retrieve geolocation data</p>
          <p>• Private/reserved IP addresses (like 192.168.x.x or 10.x.x.x) won't have geolocation data</p>
          <p>• Location data is approximate and based on the IP owner's registration</p>
          <p>• All lookups are performed client-side for privacy</p>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
