import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { Maximize2, RefreshCw, LayoutGrid } from 'lucide-react';

interface CommonRatio {
  name: string;
  ratio: string;
  width: number;
  height: number;
  description: string;
}

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [ratioWidth, setRatioWidth] = useState('16');
  const [ratioHeight, setRatioHeight] = useState('9');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('aspect-ratio-calculator');
  }, [addRecentTool]);

  const commonRatios: CommonRatio[] = [
    { name: '16:9', ratio: '16:9', width: 16, height: 9, description: 'HD, Full HD, 4K' },
    { name: '4:3', ratio: '4:3', width: 4, height: 3, description: 'Standard, iPad' },
    { name: '1:1', ratio: '1:1', width: 1, height: 1, description: 'Square, Instagram' },
    { name: '21:9', ratio: '21:9', width: 21, height: 9, description: 'Ultrawide' },
    { name: '9:16', ratio: '9:16', width: 9, height: 16, description: 'Portrait, Stories' },
    { name: '3:2', ratio: '3:2', width: 3, height: 2, description: 'Classic Photo' },
  ];

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateAspectRatio = (w: number, h: number): string => {
    const divisor = gcd(w, h);
    return `${w / divisor}:${h / divisor}`;
  };

  const calculateHeightFromWidth = (w: number, rw: number, rh: number): number => {
    return Math.round((w * rh) / rw);
  };

  const calculateWidthFromHeight = (h: number, rw: number, rh: number): number => {
    return Math.round((h * rw) / rh);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    const w = parseFloat(value);
    const rw = parseFloat(ratioWidth);
    const rh = parseFloat(ratioHeight);
    if (!isNaN(w) && !isNaN(rw) && !isNaN(rh) && rw > 0 && rh > 0) {
      setHeight(calculateHeightFromWidth(w, rw, rh).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    const h = parseFloat(value);
    const rw = parseFloat(ratioWidth);
    const rh = parseFloat(ratioHeight);
    if (!isNaN(h) && !isNaN(rw) && !isNaN(rh) && rw > 0 && rh > 0) {
      setWidth(calculateWidthFromHeight(h, rw, rh).toString());
    }
  };

  const handleRatioChange = (rw: string, rh: string) => {
    setRatioWidth(rw);
    setRatioHeight(rh);
    const w = parseFloat(width);
    const ratioW = parseFloat(rw);
    const ratioH = parseFloat(rh);
    if (!isNaN(w) && !isNaN(ratioW) && !isNaN(ratioH) && ratioW > 0 && ratioH > 0) {
      setHeight(calculateHeightFromWidth(w, ratioW, ratioH).toString());
    }
  };

  const loadCommonRatio = (ratio: CommonRatio) => {
    setRatioWidth(ratio.width.toString());
    setRatioHeight(ratio.height.toString());
    const w = parseFloat(width);
    if (!isNaN(w)) {
      setHeight(calculateHeightFromWidth(w, ratio.width, ratio.height).toString());
    }
  };

  const calculateFromDimensions = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const ratio = calculateAspectRatio(w, h);
      const [rw, rh] = ratio.split(':').map(Number);
      setRatioWidth(rw.toString());
      setRatioHeight(rh.toString());
    }
  };

  const swapDimensions = () => {
    const tempWidth = width;
    const tempHeight = height;
    setWidth(tempHeight);
    setHeight(tempWidth);
    const tempRatioWidth = ratioWidth;
    const tempRatioHeight = ratioHeight;
    setRatioWidth(tempRatioHeight);
    setRatioHeight(tempRatioWidth);
  };

  const getAspectRatioDecimal = (): string => {
    const rw = parseFloat(ratioWidth);
    const rh = parseFloat(ratioHeight);
    if (!isNaN(rw) && !isNaN(rh) && rh > 0) {
      return (rw / rh).toFixed(4);
    }
    return '0';
  };

  const getVisualRatio = (): { width: string; height: string } => {
    const rw = parseFloat(ratioWidth);
    const rh = parseFloat(ratioHeight);
    if (!isNaN(rw) && !isNaN(rh) && rw > 0 && rh > 0) {
      const maxSize = 200;
      if (rw >= rh) {
        const width = maxSize;
        const height = (maxSize * rh) / rw;
        return { width: `${width}px`, height: `${height}px` };
      } else {
        const height = maxSize;
        const width = (maxSize * rw) / rh;
        return { width: `${width}px`, height: `${height}px` };
      }
    }
    return { width: '200px', height: '200px' };
  };

  const visualSize = getVisualRatio();

  return (
    <ToolPageLayout
      seo={{
        title: "Aspect Ratio Calculator - Calculate and Convert Aspect Ratios",
        description: "Calculate and convert aspect ratios for images and videos online. Free aspect ratio calculator for designers and content creators. Find width or height for any aspect ratio.",
        keywords: "aspect ratio calculator, aspect ratio, image aspect ratio, video aspect ratio, resolution calculator, aspect ratio converter, free calculator",
        path: "/tools/aspect-ratio-calculator"
      }}
      icon={LayoutGrid}
      title="Aspect Ratio Calculator"
      description="Calculate dimensions and aspect ratios for images, videos, and screens"
    >
      {/* Common Ratios */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">Common Aspect Ratios</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {commonRatios.map((ratio) => (
            <Button
              key={ratio.name}
              onClick={() => loadCommonRatio(ratio)}
              variant="outline"
              className="flex flex-col h-auto py-4 hover:border-primary"
            >
              <div className="text-lg font-bold mb-1">{ratio.name}</div>
              <div className="text-xs text-muted-foreground">{ratio.description}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Visual Preview */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col items-center relative z-10">
          <h3 className="text-lg font-bold mb-6">Visual Preview</h3>
          <div className="flex items-center justify-center min-h-[240px] w-full">
            <div
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-2xl flex items-center justify-center border-4 border-white/20 dark:border-white/10 transition-all duration-300"
              style={visualSize}
            >
              <div className="text-white text-center p-4">
                <div className="text-2xl font-bold mb-2">
                  {ratioWidth}:{ratioHeight}
                </div>
                <div className="text-sm opacity-90">{getAspectRatioDecimal()}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Dimensions Calculator */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-bold">Calculate Dimensions</h3>
          <Button onClick={swapDimensions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Swap
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {/* Width */}
          <div>
            <label className="text-sm font-medium mb-2 block">Width (px)</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              placeholder="Enter width"
              className="text-lg h-12"
            />
          </div>

          {/* Height */}
          <div>
            <label className="text-sm font-medium mb-2 block">Height (px)</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              placeholder="Enter height"
              className="text-lg h-12"
            />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-muted/50 backdrop-blur-sm text-center relative z-10">
          <div className="text-sm text-muted-foreground mb-1">Current Dimensions</div>
          <div className="text-2xl font-bold">
            {width} × {height}
          </div>
        </div>
      </Card>

      {/* Aspect Ratio Input */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-bold">Aspect Ratio</h3>
          <Button onClick={calculateFromDimensions} variant="outline" size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Calculate from Dimensions
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-end relative z-10">
          {/* Ratio Width */}
          <div>
            <label className="text-sm font-medium mb-2 block">Ratio Width</label>
            <Input
              type="number"
              value={ratioWidth}
              onChange={(e) => handleRatioChange(e.target.value, ratioHeight)}
              placeholder="16"
              className="text-lg h-12"
            />
          </div>

          {/* Separator */}
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground">:</div>
          </div>

          {/* Ratio Height */}
          <div>
            <label className="text-sm font-medium mb-2 block">Ratio Height</label>
            <Input
              type="number"
              value={ratioHeight}
              onChange={(e) => handleRatioChange(ratioWidth, e.target.value)}
              placeholder="9"
              className="text-lg h-12"
            />
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4 relative z-10">
          <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm text-center border border-border">
            <div className="text-xs text-muted-foreground mb-1">Aspect Ratio</div>
            <div className="text-xl font-bold">
              {ratioWidth}:{ratioHeight}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm text-center border border-border">
            <div className="text-xs text-muted-foreground mb-1">Decimal</div>
            <div className="text-xl font-bold">{getAspectRatioDecimal()}</div>
          </div>
        </div>
      </Card>

      {/* Use Cases */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">Common Use Cases</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
          <div className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm">
            <div className="font-semibold mb-2">📺 Video & Screens</div>
            <div className="text-muted-foreground">
              16:9 (HD, 4K), 21:9 (Ultrawide), 4:3 (Classic TV)
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm">
            <div className="font-semibold mb-2">📱 Social Media</div>
            <div className="text-muted-foreground">
              1:1 (Instagram Post), 9:16 (Stories), 4:5 (Portrait)
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm">
            <div className="font-semibold mb-2">📷 Photography</div>
            <div className="text-muted-foreground">
              3:2 (DSLR), 4:3 (Micro Four Thirds), 16:9 (Landscape)
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm">
            <div className="font-semibold mb-2">🎬 Cinema</div>
            <div className="text-muted-foreground">
              2.39:1 (Anamorphic), 1.85:1 (Flat), 2.76:1 (Ultra Panavision)
            </div>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
