import Papa from 'papaparse';

export function jsonToCsv(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    const array = Array.isArray(parsed) ? parsed : [parsed];
    const csv = Papa.unparse(array);
    return csv;
  } catch (error) {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function csvToJson(csvString: string, spaces: number = 2): string {
  try {
    const result = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
    });
    if (result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    return JSON.stringify(result.data, null, spaces);
  } catch (error) {
    throw new Error('Invalid CSV: ' + (error as Error).message);
  }
}
