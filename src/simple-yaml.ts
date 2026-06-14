type Scalar = string | number | boolean;
type ParsedValue = Scalar | ParsedObject | ParsedArray;
type ParsedArray = ParsedValue[];
interface ParsedObject {
  [key: string]: ParsedValue;
}

type Line = {
  indent: number;
  text: string;
};

function parseScalar(value: string): Scalar {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value.replace(/^["']|["']$/g, "");
}

function tokenize(source: string): Line[] {
  return source
    .split(/\r?\n/)
    .map((line: string): string => line.replace(/\s+#.*$/, ""))
    .filter((line: string): boolean => line.trim().length > 0)
    .map((line: string): Line => ({
      indent: line.match(/^ */)?.[0].length ?? 0,
      text: line.trim()
    }));
}

function splitKeyValue(text: string): [string, string] {
  const [key, rawValue = ""] = text.split(/:\s*/, 2);
  if (key === undefined || key.length === 0) {
    throw new Error(`Invalid YAML key: ${text}`);
  }
  return [key, rawValue];
}

function parseBlock(lines: Line[], start: number, indent: number): [ParsedValue, number] {
  if (lines[start]?.text.startsWith("- ")) {
    return parseArray(lines, start, indent);
  }
  return parseObject(lines, start, indent);
}

function parseArray(lines: Line[], start: number, indent: number): [ParsedValue[], number] {
  const values: ParsedValue[] = [];
  let index = start;

  while (index < lines.length && lines[index]?.indent === indent && lines[index]?.text.startsWith("- ")) {
    const line = lines[index];
    if (line === undefined) {
      break;
    }

    const item = line.text.slice(2).trim();
    if (item.length === 0) {
      const [nested, nextIndex] = parseBlock(lines, index + 1, indent + 2);
      values.push(nested);
      index = nextIndex;
      continue;
    }

    if (item.includes(":")) {
      const [key, rawValue] = splitKeyValue(item);
      const objectValue: ParsedObject = {};
      if (rawValue.length > 0) {
        objectValue[key] = parseScalar(rawValue);
        index += 1;
      } else {
        const [nested, nextIndex] = parseBlock(lines, index + 1, indent + 2);
        objectValue[key] = nested;
        index = nextIndex;
      }

      while (index < lines.length && lines[index]?.indent === indent + 2 && !lines[index]?.text.startsWith("- ")) {
        const current = lines[index];
        if (current === undefined) {
          break;
        }
        const [nestedKey, nestedRawValue] = splitKeyValue(current.text);
        if (nestedRawValue.length > 0) {
          objectValue[nestedKey] = parseScalar(nestedRawValue);
          index += 1;
        } else {
          const [nested, nextIndex] = parseBlock(lines, index + 1, indent + 4);
          objectValue[nestedKey] = nested;
          index = nextIndex;
        }
      }

      values.push(objectValue);
      continue;
    }

    values.push(parseScalar(item));
    index += 1;
  }

  return [values, index];
}

function parseObject(lines: Line[], start: number, indent: number): [ParsedObject, number] {
  const value: ParsedObject = {};
  let index = start;

  while (index < lines.length && lines[index]?.indent === indent && !lines[index]?.text.startsWith("- ")) {
    const line = lines[index];
    if (line === undefined) {
      break;
    }

    const [key, rawValue] = splitKeyValue(line.text);
    if (rawValue.length > 0) {
      value[key] = parseScalar(rawValue);
      index += 1;
    } else {
      const [nested, nextIndex] = parseBlock(lines, index + 1, indent + 2);
      value[key] = nested;
      index = nextIndex;
    }
  }

  return [value, index];
}

export function parseYaml(source: string): ParsedObject {
  const lines = tokenize(source);
  if (lines.length === 0) {
    return {};
  }
  const [value] = parseObject(lines, 0, lines[0]?.indent ?? 0);
  return value;
}
