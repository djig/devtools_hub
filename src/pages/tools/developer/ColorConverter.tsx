import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../../../utils/converters/color';

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
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Color Converter</h1>
        <p className="text-muted-foreground">
          Convert between HEX, RGB, and HSL color formats
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div
            className="w-32 h-32 rounded-lg border-2 border-border shadow-sm"
            style={{ backgroundColor: hexInput }}
          />
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">Color Picker</label>
            <input
              type="color"
              value={hexInput}
              onChange={(e) => {
                setHexInput(e.target.value);
                updateFromHex(e.target.value);
              }}
              className="w-full h-12 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">HEX</h3>
          <CopyButton text={hexInput} />
        </div>
        <Input
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            updateFromHex(e.target.value);
          }}
          className="font-mono"
          placeholder="#000000"
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">RGB</h3>
          <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">R</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.r}
              onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">G</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.g}
              onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">B</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.b}
              onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mt-2 p-2 rounded bg-muted/50 font-mono text-sm">
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">HSL</h3>
          <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">H</label>
            <Input
              type="number"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">S</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">L</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mt-2 p-2 rounded bg-muted/50 font-mono text-sm">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </Card>
    </div>
  );
}
