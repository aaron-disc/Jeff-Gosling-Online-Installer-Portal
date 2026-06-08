import { parseCSV } from "../utils/csvParser";

const response = await fetch(new URL('./DISCExport.csv', import.meta.url));
const csvText = await response.text();

const pdfUrl = new URL('../images/Slide 14.pdf', import.meta.url).href;

export const VEHICLES = parseCSV(csvText).map((v, i) => ({
  ...v,
  id: i + 1,
  bootHoistPdf: pdfUrl,
}));