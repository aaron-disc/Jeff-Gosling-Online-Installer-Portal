import { parseCSV } from "../utils/csvParser";
import type { Vehicle } from "./types";

const response = await fetch(new URL('./VehicleList.csv', import.meta.url));
const csvText = await response.text();

export const VEHICLES: Vehicle[] = parseCSV(csvText).map((v, i) => ({
  ...v,
  id: i + 1,
  bootHoistPdf: v.pdfUrl ? new URL(v.pdfUrl, import.meta.url).href : null,
})) as Vehicle[];
