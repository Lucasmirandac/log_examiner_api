export class UtilsService {
  csvJSON<T>(csv: string): T[] {
    const lines = csv.split("\n");
    const result: any[] = [];

    if (lines.length < 2) {
      return result;
    }

    // Parse headers first
    const headers = this.parseCSVLine(lines[0]);

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      const values = this.parseCSVLine(line);

      if (values.length !== headers.length) {
        console.warn(
          `Row ${i} has ${values.length} values but headers has ${headers.length}`
        );
        continue;
      }

      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j];
      }
      result.push(obj);
    }

    return result as T[];
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let braceCount = 0;
    let inJson = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === "{" && !inQuotes) {
        braceCount++;
        inJson = true;
      }

      if (char === "}" && !inQuotes) {
        braceCount--;
        if (braceCount === 0) {
          inJson = false;
        }
      }

      if (char === "," && !inQuotes && !inJson) {
        result.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    // Add the last field
    result.push(current.trim());
    return result;
  }
}
