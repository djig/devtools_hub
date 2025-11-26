export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+|_|-/g, '');
}

export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+|_|-/g, '');
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/\s+|-/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/\s+|_/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

export function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function toLowercase(str: string): string {
  return str.toLowerCase();
}

export function toUppercase(str: string): string {
  return str.toUpperCase();
}
