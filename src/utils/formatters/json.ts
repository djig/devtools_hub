export function formatJson(input: string, spaces: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, spaces);
  } catch {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch {
    return { valid: false, error: (error as Error).message };
  }
}
