export function parseCSV(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        current.push(field.trim());
        field = "";
      } else if (char === "\r") {
        continue;
      } else if (char === "\n") {
        current.push(field.trim());
        field = "";
        rows.push(current);
        current = [];
      } else {
        field += char;
      }
    }
  }

  if (field || current.length > 0) {
    current.push(field.trim());
    rows.push(current);
  }

  const nonEmptyRows = rows.filter((row) => row.some((c) => c !== ""));

  if (nonEmptyRows.length < 2) return [];

  const rawHeaders = nonEmptyRows[0];
  const headers = rawHeaders.map((h: string) =>
    h ? h.charAt(0).toLowerCase() + h.slice(1) : h,
  );
  return nonEmptyRows.slice(1).map((row: string[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] !== undefined ? row[i] : "";
    });
    return obj;
  });
}
