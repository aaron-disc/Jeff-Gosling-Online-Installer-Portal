import type { Vehicle } from "./types";

const response = await fetch(`${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/api/local-csv`);
const json = await response.json();

const pdfModules = import.meta.glob("../pdfs/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const pdfNames = new Map<string, string>();
for (const [filePath, url] of Object.entries(pdfModules)) {
  const filename = filePath.split("/").pop()?.toLowerCase() || "";
  pdfNames.set(filename, url);
}

function findMatchingPdf(v: Record<string, string>): string | null {
  const parts = [
    v.manufacturer || "",
    v.model || "",
    v.hoistVehicleVariant || "",
  ];
  const expectedName =
    parts.filter(Boolean).join(" ").toLowerCase().trim() + ".pdf";
  return pdfNames.get(expectedName) ?? null;
}

export const VEHICLES: Vehicle[] = (Array.isArray(json) ? json : []).map(
  (v: Record<string, string>, i: number) => ({
    ...v,
    id: i + 1,
    bootHoistPdf: findMatchingPdf(v),
  }),
) as Vehicle[];
