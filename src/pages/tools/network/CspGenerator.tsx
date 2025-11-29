import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Textarea } from '../../../components/ui/Textarea';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Shield, Info } from 'lucide-react';
import { SEO } from '../../../utils/seo';

interface CSPDirective {
  name: string;
  label: string;
  values: string[];
  description: string;
}

const directiveOptions = [
  "'self'",
  "'none'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "https:",
  "http:",
  "data:",
  "blob:",
  "*",
];

export default function CspGenerator() {
  const { addRecentTool } = useAppStore();
  const [directives, setDirectives] = useState<Record<string, string[]>>({
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  });

  const [customDomains, setCustomDomains] = useState<Record<string, string>>({});
  const [strictness, setStrictnessLevel] = useState<'strict' | 'moderate' | 'permissive'>('moderate');

  useEffect(() => {
    addRecentTool('csp-generator');
  }, [addRecentTool]);

  const availableDirectives: CSPDirective[] = [
    { name: 'default-src', label: 'Default Source', values: [], description: 'Fallback for other directives' },
    { name: 'script-src', label: 'Scripts', values: [], description: 'JavaScript sources' },
    { name: 'style-src', label: 'Styles', values: [], description: 'CSS sources' },
    { name: 'img-src', label: 'Images', values: [], description: 'Image sources' },
    { name: 'font-src', label: 'Fonts', values: [], description: 'Font sources' },
    { name: 'connect-src', label: 'Connections', values: [], description: 'XHR, WebSocket, fetch' },
    { name: 'media-src', label: 'Media', values: [], description: 'Audio and video sources' },
    { name: 'object-src', label: 'Objects', values: [], description: 'Plugin sources' },
    { name: 'frame-src', label: 'Frames', values: [], description: 'iframe sources' },
    { name: 'worker-src', label: 'Workers', values: [], description: 'Worker, SharedWorker, ServiceWorker' },
    { name: 'manifest-src', label: 'Manifest', values: [], description: 'Web app manifest' },
    { name: 'base-uri', label: 'Base URI', values: [], description: 'Base element URL' },
    { name: 'form-action', label: 'Form Action', values: [], description: 'Form submission targets' },
    { name: 'frame-ancestors', label: 'Frame Ancestors', values: [], description: 'Parent that can embed' },
  ];

  const toggleDirectiveValue = (directive: string, value: string) => {
    setDirectives((prev) => {
      const current = prev[directive] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [directive]: newValues };
    });
  };

  const addCustomDomain = (directive: string) => {
    const domain = customDomains[directive]?.trim();
    if (domain) {
      setDirectives((prev) => ({
        ...prev,
        [directive]: [...(prev[directive] || []), domain],
      }));
      setCustomDomains((prev) => ({ ...prev, [directive]: '' }));
    }
  };

  const removeDirectiveValue = (directive: string, value: string) => {
    setDirectives((prev) => ({
      ...prev,
      [directive]: (prev[directive] || []).filter((v) => v !== value),
    }));
  };

  const generateCSP = (): string => {
    const parts: string[] = [];

    Object.entries(directives).forEach(([directive, values]) => {
      if (values.length > 0 || directive === 'upgrade-insecure-requests') {
        if (directive === 'upgrade-insecure-requests') {
          parts.push('upgrade-insecure-requests');
        } else {
          parts.push(`${directive} ${values.join(' ')}`);
        }
      }
    });

    return parts.join('; ');
  };

  const loadStrictPolicy = () => {
    setDirectives({
      'default-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'img-src': ["'self'"],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': [],
    });
    setStrictnessLevel('strict');
  };

  const loadModeratePolicy = () => {
    setDirectives({
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "data:"],
      'connect-src': ["'self'"],
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'upgrade-insecure-requests': [],
    });
    setStrictnessLevel('moderate');
  };

  const loadPermissivePolicy = () => {
    setDirectives({
      'default-src': ["'self'", "https:", "http:"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:", "http:"],
      'font-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https:", "http:"],
      'frame-src': ["'self'"],
      'object-src': ["'self'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
    });
    setStrictnessLevel('permissive');
  };

  const cspHeader = generateCSP();

  return (
    <>
      <SEO
        title="CSP Header Generator - Generate Content Security Policy Headers"
        description="Generate Content Security Policy (CSP) headers online. Free CSP generator that helps secure your web applications against XSS and injection attacks. Build CSP policies easily."
        keywords="csp generator, content security policy, csp header, security header, csp tool, web security, xss prevention, free generator"
        path="/tools/csp-generator"
      />
      <div className="space-y-6">
      {/* Compact Header with Breadcrumb */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-background p-6">
        <div className="relative z-10 space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="px-6 pt-4 pb-2">
            <Breadcrumb />
          </div>

          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CSP Header Generator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Generate Content Security Policy headers to protect your website from XSS and data injection attacks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Policies */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Preset Policies</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={loadStrictPolicy}
            variant={strictness === 'strict' ? 'default' : 'outline'}
          >
            Strict
          </Button>
          <Button
            onClick={loadModeratePolicy}
            variant={strictness === 'moderate' ? 'default' : 'outline'}
          >
            Moderate (Recommended)
          </Button>
          <Button
            onClick={loadPermissivePolicy}
            variant={strictness === 'permissive' ? 'default' : 'outline'}
          >
            Permissive
          </Button>
        </div>
      </Card>

      {/* Directive Configuration */}
      <div className="grid gap-4">
        {availableDirectives.map((directive) => (
          <Card key={directive.name} className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{directive.label}</h4>
                <p className="text-xs text-muted-foreground">{directive.description}</p>
              </div>

              {/* Common Options */}
              <div className="flex flex-wrap gap-2">
                {directiveOptions.map((option) => {
                  const isSelected = directives[directive.name]?.includes(option);
                  return (
                    <Button
                      key={option}
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleDirectiveValue(directive.name, option)}
                      className="text-xs"
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>

              {/* Custom Values */}
              {directives[directive.name]?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {directives[directive.name].map((value) => {
                    // Don't show predefined options again
                    if (directiveOptions.includes(value)) return null;
                    return (
                      <div
                        key={value}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs"
                      >
                        <code>{value}</code>
                        <button
                          onClick={() => removeDirectiveValue(directive.name, value)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Custom Domain */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom domain (e.g., cdn.example.com)"
                  value={customDomains[directive.name] || ''}
                  onChange={(e) =>
                    setCustomDomains((prev) => ({ ...prev, [directive.name]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && addCustomDomain(directive.name)}
                  className="flex-1 px-3 py-1.5 text-sm rounded border border-border bg-background"
                />
                <Button size="sm" onClick={() => addCustomDomain(directive.name)}>
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Upgrade Insecure Requests */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Upgrade Insecure Requests</h4>
              <p className="text-xs text-muted-foreground">
                Automatically upgrade HTTP requests to HTTPS
              </p>
            </div>
            <Button
              size="sm"
              variant={directives['upgrade-insecure-requests']?.length === 0 ? 'default' : 'outline'}
              onClick={() =>
                setDirectives((prev) => ({
                  ...prev,
                  'upgrade-insecure-requests': prev['upgrade-insecure-requests']?.length === 0 ? [] : [],
                }))
              }
            >
              {directives['upgrade-insecure-requests'] !== undefined ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Generated CSP */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Generated CSP Header</h3>
          </div>
          {cspHeader && <CopyButton text={cspHeader} />}
        </div>
        <Textarea
          value={cspHeader}
          readOnly
          className="min-h-[150px] font-mono text-sm"
          placeholder="Configure directives above to generate CSP header..."
        />
      </Card>

      {/* Implementation Examples */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Implementation Examples</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">HTML Meta Tag:</p>
            <code className="block p-3 rounded bg-muted text-xs break-all">
              &lt;meta http-equiv="Content-Security-Policy" content="{cspHeader || 'YOUR_CSP_HERE'}"&gt;
            </code>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">HTTP Header (nginx):</p>
            <code className="block p-3 rounded bg-muted text-xs break-all">
              add_header Content-Security-Policy "{cspHeader || 'YOUR_CSP_HERE'}";
            </code>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">HTTP Header (Apache):</p>
            <code className="block p-3 rounded bg-muted text-xs break-all">
              Header set Content-Security-Policy "{cspHeader || 'YOUR_CSP_HERE'}"
            </code>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Node.js/Express:</p>
            <code className="block p-3 rounded bg-muted text-xs break-all">
              res.setHeader('Content-Security-Policy', "{cspHeader || 'YOUR_CSP_HERE'}");
            </code>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          About Content Security Policy
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>CSP</strong> helps prevent XSS, clickjacking, and other code injection attacks</p>
          <p>• <strong>'self'</strong> allows resources from the same origin</p>
          <p>• <strong>'none'</strong> blocks all resources of that type</p>
          <p>• <strong>'unsafe-inline'</strong> allows inline scripts/styles (not recommended)</p>
          <p>• <strong>'unsafe-eval'</strong> allows eval() and similar (not recommended)</p>
          <p>• Start with a strict policy and relax as needed based on browser console errors</p>
          <p>• Test thoroughly before deploying to production</p>
        </div>
      </Card>
      </div>
    </>
  );
}
