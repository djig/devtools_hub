const htmlEntities: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

const htmlEntitiesReverse: { [key: string]: string } = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x2F;': '/',
};

export function encodeHtml(text: string): string {
  return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char]);
}

export function decodeHtml(text: string): string {
  return text.replace(/&[#\w]+;/g, (entity) => {
    if (htmlEntitiesReverse[entity]) {
      return htmlEntitiesReverse[entity];
    }
    // Handle numeric entities
    if (entity.startsWith('&#')) {
      const code = entity.startsWith('&#x')
        ? parseInt(entity.slice(3, -1), 16)
        : parseInt(entity.slice(2, -1), 10);
      return String.fromCharCode(code);
    }
    return entity;
  });
}
