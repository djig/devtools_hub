export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

export function countText(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const lines = text === '' ? 0 : text.split('\n').length;

  const sentences = text.trim() === ''
    ? 0
    : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const paragraphs = text.trim() === ''
    ? 0
    : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(words / 200);

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    sentences,
    paragraphs,
    readingTime,
  };
}
