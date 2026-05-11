export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map((v) => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || "";
    });

    const start = obj.Start || "";
    const end = obj.End || "";
    //const year = end ? `${start} - ${end}` : start;

    const designStatus = obj["Design Status"] || "";

    return {
      id: index + 1,
      make: obj.Manufacturer || "",
      model: obj.Model || "",
      variant: obj.Variant || "",
      start: start,
      end: end,
      designStatus: designStatus,
      bootHoistPdf: null,
    };
  });
}
