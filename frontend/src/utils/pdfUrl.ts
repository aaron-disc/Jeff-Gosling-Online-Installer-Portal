import type { Vehicle } from "../data/types";

const API_BASE = `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}`;

export function getBootHoistPdfUrl(vehicle: Vehicle): string | null {
  const fileName = vehicle.hoistFittingPDFFileName?.trim();
  if (!fileName) return null;
  return `${API_BASE}/api/pdf?pdfFileName=${encodeURIComponent(fileName)}`;
}

export async function checkBootHoistPdfExists(
  vehicle: Vehicle,
): Promise<boolean> {
  const pdfUrl = getBootHoistPdfUrl(vehicle);
  if (!pdfUrl) return false;

  try {
    const response = await fetch(pdfUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
