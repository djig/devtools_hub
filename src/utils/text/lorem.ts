const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

export function generateLoremWords(count: number): string {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  }
  return words.join(' ');
}

export function generateLoremSentences(count: number): string {
  const sentences = [];
  for (let i = 0; i < count; i++) {
    const wordCount = Math.floor(Math.random() * 10) + 5;
    const sentence = generateLoremWords(wordCount);
    sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
  }
  return sentences.join(' ');
}

export function generateLoremParagraphs(count: number): string {
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 5) + 3;
    paragraphs.push(generateLoremSentences(sentenceCount));
  }
  return paragraphs.join('\n\n');
}
