export type UnitCategory = 'length' | 'weight' | 'temperature' | 'data';

export interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export const UNIT_CATEGORIES: Record<UnitCategory, { name: string; units: Record<string, Unit> }> = {
  length: {
    name: 'Length',
    units: {
      millimeter: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      meter: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      kilometer: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      inch: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      foot: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yard: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mile: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
  },
  weight: {
    name: 'Weight',
    units: {
      milligram: { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gram: { name: 'Gram', symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
      kilogram: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      ounce: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
      pound: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
      ton: { name: 'Ton', symbol: 't', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: {
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      fahrenheit: {
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      kelvin: {
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  data: {
    name: 'Data Size',
    units: {
      bit: { name: 'Bit', symbol: 'bit', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
      byte: { name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      kilobyte: { name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      megabyte: { name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      gigabyte: { name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024) },
      terabyte: { name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1024 * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024 * 1024) },
    },
  },
};

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: UnitCategory
): number {
  const units = UNIT_CATEGORIES[category].units;
  const from = units[fromUnit];
  const to = units[toUnit];

  if (!from || !to) {
    throw new Error('Invalid units');
  }

  const baseValue = from.toBase(value);
  return to.fromBase(baseValue);
}
