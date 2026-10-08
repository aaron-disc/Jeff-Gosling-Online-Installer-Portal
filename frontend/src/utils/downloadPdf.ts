import type { Vehicle } from "../data/types";
import { getBootHoistPdfUrl } from "./pdfUrl";

export async function downloadPdf(vehicle: Vehicle): Promise<void> {
  const pdfUrl = getBootHoistPdfUrl(vehicle);
  if (!pdfUrl) return;
  const response = await fetch(pdfUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${vehicle.manufacturer}_${vehicle.model}_Installation_Guide.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
