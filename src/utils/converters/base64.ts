export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch (err) {
    throw new Error('Failed to encode: ' + (err as Error).message);
  }
}

export function decodeBase64(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch (err) {
    throw new Error('Failed to decode: ' + (err as Error).message);
  }
}

export function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}
