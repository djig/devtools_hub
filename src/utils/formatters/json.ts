export function formatJson(input: string, spaces: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, spaces);
  } catch (error) {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}
