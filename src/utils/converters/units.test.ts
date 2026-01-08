import { describe, it, expect } from 'vitest';
import { convertUnit, UNIT_CATEGORIES } from './units';

describe('units', () => {
  describe('convertUnit', () => {
    describe('length conversions', () => {
      it('converts meters to kilometers', () => {
        expect(convertUnit(1000, 'meter', 'kilometer', 'length')).toBe(1);
      });

      it('converts kilometers to meters', () => {
        expect(convertUnit(1, 'kilometer', 'meter', 'length')).toBe(1000);
      });

      it('converts meters to centimeters', () => {
        expect(convertUnit(1, 'meter', 'centimeter', 'length')).toBe(100);
      });

      it('converts centimeters to millimeters', () => {
        expect(convertUnit(1, 'centimeter', 'millimeter', 'length')).toBe(10);
      });

      it('converts inches to centimeters', () => {
        expect(convertUnit(1, 'inch', 'centimeter', 'length')).toBeCloseTo(2.54, 2);
      });

      it('converts feet to meters', () => {
        expect(convertUnit(1, 'foot', 'meter', 'length')).toBeCloseTo(0.3048, 4);
      });

      it('converts yards to meters', () => {
        expect(convertUnit(1, 'yard', 'meter', 'length')).toBeCloseTo(0.9144, 4);
      });

      it('converts miles to kilometers', () => {
        expect(convertUnit(1, 'mile', 'kilometer', 'length')).toBeCloseTo(1.609344, 4);
      });

      it('handles same unit conversion', () => {
        expect(convertUnit(100, 'meter', 'meter', 'length')).toBe(100);
      });
    });

    describe('weight conversions', () => {
      it('converts grams to kilograms', () => {
        expect(convertUnit(1000, 'gram', 'kilogram', 'weight')).toBe(1);
      });

      it('converts kilograms to grams', () => {
        expect(convertUnit(1, 'kilogram', 'gram', 'weight')).toBe(1000);
      });

      it('converts grams to milligrams', () => {
        expect(convertUnit(1, 'gram', 'milligram', 'weight')).toBe(1000);
      });

      it('converts pounds to kilograms', () => {
        expect(convertUnit(1, 'pound', 'gram', 'weight')).toBeCloseTo(453.592, 2);
      });

      it('converts ounces to grams', () => {
        expect(convertUnit(1, 'ounce', 'gram', 'weight')).toBeCloseTo(28.3495, 2);
      });

      it('converts tons to kilograms', () => {
        expect(convertUnit(1, 'ton', 'kilogram', 'weight')).toBe(1000);
      });
    });

    describe('temperature conversions', () => {
      it('converts Celsius to Fahrenheit', () => {
        expect(convertUnit(0, 'celsius', 'fahrenheit', 'temperature')).toBe(32);
      });

      it('converts Fahrenheit to Celsius', () => {
        expect(convertUnit(32, 'fahrenheit', 'celsius', 'temperature')).toBeCloseTo(0, 2);
      });

      it('converts Celsius to Kelvin', () => {
        expect(convertUnit(0, 'celsius', 'kelvin', 'temperature')).toBeCloseTo(273.15, 2);
      });

      it('converts Kelvin to Celsius', () => {
        expect(convertUnit(273.15, 'kelvin', 'celsius', 'temperature')).toBeCloseTo(0, 2);
      });

      it('converts 100 Celsius to Fahrenheit', () => {
        expect(convertUnit(100, 'celsius', 'fahrenheit', 'temperature')).toBe(212);
      });

      it('converts -40 (same in both scales)', () => {
        expect(convertUnit(-40, 'celsius', 'fahrenheit', 'temperature')).toBe(-40);
        expect(convertUnit(-40, 'fahrenheit', 'celsius', 'temperature')).toBeCloseTo(-40, 2);
      });
    });

    describe('data size conversions', () => {
      it('converts bytes to kilobytes', () => {
        expect(convertUnit(1024, 'byte', 'kilobyte', 'data')).toBe(1);
      });

      it('converts kilobytes to bytes', () => {
        expect(convertUnit(1, 'kilobyte', 'byte', 'data')).toBe(1024);
      });

      it('converts kilobytes to megabytes', () => {
        expect(convertUnit(1024, 'kilobyte', 'megabyte', 'data')).toBe(1);
      });

      it('converts megabytes to gigabytes', () => {
        expect(convertUnit(1024, 'megabyte', 'gigabyte', 'data')).toBe(1);
      });

      it('converts gigabytes to terabytes', () => {
        expect(convertUnit(1024, 'gigabyte', 'terabyte', 'data')).toBe(1);
      });

      it('converts bits to bytes', () => {
        expect(convertUnit(8, 'bit', 'byte', 'data')).toBe(1);
      });

      it('converts bytes to bits', () => {
        expect(convertUnit(1, 'byte', 'bit', 'data')).toBe(8);
      });
    });

    describe('error handling', () => {
      it('throws error for invalid from unit', () => {
        expect(() => convertUnit(1, 'invalid', 'meter', 'length')).toThrow('Invalid units');
      });

      it('throws error for invalid to unit', () => {
        expect(() => convertUnit(1, 'meter', 'invalid', 'length')).toThrow('Invalid units');
      });
    });
  });

  describe('UNIT_CATEGORIES', () => {
    it('has length category', () => {
      expect(UNIT_CATEGORIES.length).toBeDefined();
      expect(UNIT_CATEGORIES.length.name).toBe('Length');
    });

    it('has weight category', () => {
      expect(UNIT_CATEGORIES.weight).toBeDefined();
      expect(UNIT_CATEGORIES.weight.name).toBe('Weight');
    });

    it('has temperature category', () => {
      expect(UNIT_CATEGORIES.temperature).toBeDefined();
      expect(UNIT_CATEGORIES.temperature.name).toBe('Temperature');
    });

    it('has data category', () => {
      expect(UNIT_CATEGORIES.data).toBeDefined();
      expect(UNIT_CATEGORIES.data.name).toBe('Data Size');
    });

    it('length units have correct symbols', () => {
      expect(UNIT_CATEGORIES.length.units.meter.symbol).toBe('m');
      expect(UNIT_CATEGORIES.length.units.kilometer.symbol).toBe('km');
      expect(UNIT_CATEGORIES.length.units.mile.symbol).toBe('mi');
    });

    it('weight units have correct symbols', () => {
      expect(UNIT_CATEGORIES.weight.units.gram.symbol).toBe('g');
      expect(UNIT_CATEGORIES.weight.units.kilogram.symbol).toBe('kg');
      expect(UNIT_CATEGORIES.weight.units.pound.symbol).toBe('lb');
    });

    it('temperature units have correct symbols', () => {
      expect(UNIT_CATEGORIES.temperature.units.celsius.symbol).toBe('°C');
      expect(UNIT_CATEGORIES.temperature.units.fahrenheit.symbol).toBe('°F');
      expect(UNIT_CATEGORIES.temperature.units.kelvin.symbol).toBe('K');
    });

    it('data units have correct symbols', () => {
      expect(UNIT_CATEGORIES.data.units.byte.symbol).toBe('B');
      expect(UNIT_CATEGORIES.data.units.kilobyte.symbol).toBe('KB');
      expect(UNIT_CATEGORIES.data.units.megabyte.symbol).toBe('MB');
    });
  });
});
