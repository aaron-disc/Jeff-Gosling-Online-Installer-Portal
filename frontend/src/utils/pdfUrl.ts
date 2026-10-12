import type { Vehicle } from "../data/types";
import { apiFetch } from "./api";

export function getBootHoistPdfPath(vehicle: Vehicle): string | null {
  const fileName = vehicle.hoistFittingPDFFileName?.trim();
  if (!fileName) return null;
  return `/api/pdf?pdfFileName=${encodeURIComponent(fileName)}`;
}

export async function checkBootHoistPdfExists(
  vehicle: Vehicle,
): Promise<boolean> {
  const pdfPath = getBootHoistPdfPath(vehicle);
  if (!pdfPath) return false;

  try {
    const response = await apiFetch(pdfPath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
