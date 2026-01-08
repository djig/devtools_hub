import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function jsonToXml(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    const builder = new XMLBuilder({ format: true, ignoreAttributes: false, suppressEmptyNode: true });
    return builder.build(parsed);
  } catch {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function xmlToJson(xmlString: string, spaces: number = 2): string {
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlString);
    return JSON.stringify(parsed, null, spaces);
  } catch {
    throw new Error('Invalid XML: ' + (error as Error).message);
  }
}

export function formatXml(xmlString: string): string {
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlString);
    const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
    return builder.build(parsed);
  } catch {
    throw new Error('Invalid XML: ' + (error as Error).message);
  }
}
