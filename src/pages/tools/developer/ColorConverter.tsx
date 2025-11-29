import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../../../utils/converters/color';
import { Pipette, Palette } from 'lucide-react';
import { SEO } from '../../../utils/seo';

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('color-converter');
  }, [addRecentTool]);

  const updateFromHex = (hex: string) => {
    try {
      const rgbColor = hexToRgb(hex);
      setRgb(rgbColor);
      const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
      setHsl(hslColor);
    } catch (error) {
      // Invalid hex, don't update
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHexInput(rgbToHex(r, g, b));
    const hslColor = rgbToHsl(r, g, b);
    setHsl(hslColor);
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbColor = hslToRgb(h, s, l);
    setRgb(rgbColor);
    setHexInput(rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b));
  };

  useEffect(() => {
    updateFromHex(hexInput);
  }, []);

  return (
    <>
      <SEO
        title="Color Converter - Convert HEX, RGB, HSL, CMYK with Color Picker"
        description="Convert colors between HEX, RGB, HSL, and CMYK formats online. Free color converter with interactive color picker. Perfect for web designers and developers."
        keywords="color converter, hex to rgb, rgb to hex, color picker, hsl converter, cmyk converter, color tool, hex color, free converter"
        path="/tools/color-converter"
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
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Color Converter</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert between HEX, RGB, and HSL color formats with live preview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Color Preview Card */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          {/* Large Color Preview */}
          <div className="relative group">
            <div
              className="w-48 h-48 rounded-3xl border-4 border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl relative overflow-hidden"
              style={{ backgroundColor: hexInput }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg">
              <Pipette className="h-4 w-4" />
            </div>
          </div>

          {/* Color Picker Input */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                <Pipette className="h-4 w-4" />
                Pick a Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={hexInput}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    updateFromHex(e.target.value);
                  }}
                  className="w-full h-16 rounded-xl cursor-pointer border-2 border-border hover:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Brightness</div>
                <div className="text-lg font-bold">{hsl.l}%</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="text-xs text-muted-foreground mb-1">Saturation</div>
                <div className="text-lg font-bold">{hsl.s}%</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* HEX Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold">HEX</h3>
          <CopyButton text={hexInput} />
        </div>
        <Input
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            updateFromHex(e.target.value);
          }}
          className="font-mono text-lg h-12"
          placeholder="#000000"
        />
      </Card>

      {/* RGB Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold">RGB</h3>
          <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-red-600 dark:text-red-400 block mb-2">Red</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)}
                className="w-full mt-2 accent-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-green-600 dark:text-green-400 block mb-2">Green</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)}
                className="w-full mt-2 accent-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-600 dark:text-blue-400 block mb-2">Blue</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))}
                className="w-full mt-2 accent-blue-500"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm font-mono text-lg font-semibold text-center border border-border">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
        </div>
      </Card>

      {/* HSL Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold">HSL</h3>
          <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-orange-600 dark:text-orange-400 block mb-2">Hue</label>
              <Input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)}
                className="w-full mt-2 accent-orange-500"
                style={{
                  background: `linear-gradient(to right,
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%))`
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-pink-600 dark:text-pink-400 block mb-2">Saturation</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)}
                className="w-full mt-2 accent-pink-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-indigo-600 dark:text-indigo-400 block mb-2">Lightness</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))}
                className="text-center font-bold"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))}
                className="w-full mt-2 accent-indigo-500"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm font-mono text-lg font-semibold text-center border border-border">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </div>
        </div>
      </Card>
      </div>
    </>
  );
}
