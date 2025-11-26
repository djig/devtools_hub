import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CopyButton } from '../../../components/shared/CopyButton';

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  isExpired?: boolean;
}

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('jwt-decoder');
  }, [addRecentTool]);

  const decodeJWT = () => {
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      let isExpired = undefined;
      if (payload.exp) {
        isExpired = Date.now() >= payload.exp * 1000;
      }

      setDecoded({ header, payload, signature, isExpired });
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setDecoded(null);
    }
  };

  const loadSample = () => {
    // Sample JWT token (example only)
    const sample =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInput(sample);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">JWT Decoder</h1>
        <p className="text-muted-foreground">
          Decode and inspect JSON Web Tokens (JWT) without verification
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={decodeJWT}>Decode JWT</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
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

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">JWT Token</h3>
        <Textarea
          placeholder="Paste your JWT token here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
        />
      </Card>

      {decoded && (
        <>
          {decoded.isExpired !== undefined && (
            <Card
              className={
                decoded.isExpired
                  ? 'p-4 border-destructive/50 bg-destructive/10'
                  : 'p-4 border-green-500/50 bg-green-500/10'
              }
            >
              <div className="flex items-center gap-2">
                {decoded.isExpired ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <p className="font-semibold text-destructive">Token Expired</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="font-semibold text-green-600 dark:text-green-400">Token Valid</p>
                  </>
                )}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Header</h3>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Payload</h3>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>

            {decoded.payload.exp && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Expires: {new Date(decoded.payload.exp * 1000).toLocaleString()}
                </span>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Signature</h3>
              <CopyButton text={decoded.signature} />
            </div>
            <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm break-all">
              {decoded.signature}
            </pre>
          </Card>
        </>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">Note</h3>
        <p className="text-sm text-muted-foreground">
          This tool only decodes and displays JWT content. It does not verify the signature. Never
          trust client-side JWT validation for security purposes.
        </p>
      </Card>
    </div>
  );
}
