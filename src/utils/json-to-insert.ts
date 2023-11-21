export function jsonToInsert(object: object) {
  return `(${writeValues(object)})`;
}

function writeColumns(object: object) {
  const keys = Object.keys(object);

  return keys.map((key) => `"${key}"`).join(", ");
}

function writeValues(object: object) {
  const keys = Object.keys(object);

  return keys
    .map((key: string) => {
      const objectKey = key as keyof typeof object;
      const value = object[objectKey];

      return value;
    })
    .map((value) => `'${value}'`)
    .join(", ");
}

export default function toInserts(table: string, list: Array<object>) {
  const header = `INSERT INTO ${table} (${writeColumns(list[0])}) VALUES\n`;

  return header + list.map((object) => jsonToInsert(object)).join(",\n");
}
