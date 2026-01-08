import * as yaml from 'js-yaml';

export function jsonToYaml(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return yaml.dump(parsed, { indent: 2 });
  } catch {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
}

export function yamlToJson(yamlString: string, spaces: number = 2): string {
  try {
    const parsed = yaml.load(yamlString);
    return JSON.stringify(parsed, null, spaces);
  } catch {
    throw new Error('Invalid YAML: ' + (error as Error).message);
  }
}

export function formatYaml(yamlString: string): string {
  try {
    const parsed = yaml.load(yamlString);
    return yaml.dump(parsed, { indent: 2 });
  } catch {
    throw new Error('Invalid YAML: ' + (error as Error).message);
  }
}
