export function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    throw new Error('Invalid URL encoding');
  }
}

export function encodeUrlFull(url: string): string {
  return encodeURI(url);
}

export function decodeUrlFull(url: string): string {
  try {
    return decodeURI(url);
  } catch (error) {
    throw new Error('Invalid URL');
  }
}
