export function decimalToBinary(num: number): string {
  return num.toString(2);
}

export function decimalToOctal(num: number): string {
  return num.toString(8);
}

export function decimalToHex(num: number): string {
  return num.toString(16).toUpperCase();
}

export function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2);
}

export function octalToDecimal(octal: string): number {
  return parseInt(octal, 8);
}

export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

export function convertBase(value: string, fromBase: number): {
  decimal: string;
  binary: string;
  octal: string;
  hex: string;
} {
  try {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) {
      throw new Error('Invalid number');
    }

    return {
      decimal: decimal.toString(),
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      hex: decimal.toString(16).toUpperCase(),
    };
  } catch (error) {
    throw new Error('Invalid number for the selected base');
  }
}
