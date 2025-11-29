import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Textarea } from '../../../components/ui/Textarea';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { SEO } from '../../../utils/seo';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('qr-code-generator');
  }, [addRecentTool]);

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg') as HTMLElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const loadSample = () => {
    setText('https://example.com');
  };

  return (
    <>
      <SEO
        title="QR Code Generator - Free Online QR Code Creator"
        description="Generate QR codes from text or URLs online. Free QR code generator with customizable size and error correction. Download QR codes as PNG images instantly."
        keywords="qr code generator, create qr code, qr code maker, generate qr code, qr code creator, qr code tool, free qr generator"
        path="/tools/qr-code-generator"
      />
      <div className="space-y-6">
      {/* Compact Hero Section with Breadcrumb */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          {/* Breadcrumb Navigation */}
        <div className="px-6 pt-4 pb-2">
          <Breadcrumb />
        </div>

        <div className="flex items-center gap-4 px-6 pb-6">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <QrCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">QR Code Generator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Generate QR codes from text, URLs, or any string data
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Text / URL</label>
            <Textarea
              placeholder="Enter text or URL to encode..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              QR Code Size: {size}px
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={loadSample} variant="outline">
              Load Sample
            </Button>
            <Button onClick={downloadQR} disabled={!text}>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground">QR Code Preview</h3>
          <div className="flex items-center justify-center min-h-[300px]">
            {text ? (
              <QRCodeSVG
                id="qr-code-svg"
                value={text}
                size={size}
                level="H"
                includeMargin
                className="max-w-full h-auto"
              />
            ) : (
              <p className="text-muted-foreground text-center">
                Enter text or URL to generate QR code
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">Usage Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>QR codes can encode up to 4,296 alphanumeric characters</li>
          <li>URLs, contact information, WiFi credentials, and plain text work well</li>
          <li>Higher error correction (Level H) allows the code to be partially damaged</li>
          <li>Use larger sizes (256px+) for better scanning on printed materials</li>
        </ul>
      </Card>
      </div>
    </>
  );
}
