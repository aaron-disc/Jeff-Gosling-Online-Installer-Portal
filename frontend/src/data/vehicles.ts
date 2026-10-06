import type { Vehicle } from "./types";

const response = await fetch(
  `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/api/local-csv`,
);
const json = await response.json();

const pdfModules = import.meta.glob("../pdfs/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const pdfNames = new Map<string, string>();
const pdfBaseNames: { base: string; url: string }[] = [];

function pdfBaseName(filename: string): string {
  return filename.replace(/\.pdf$/, "").replace(/\s+fitting instructions$/, "");
}

for (const [filePath, url] of Object.entries(pdfModules)) {
  const filename = filePath.split("/").pop()?.toLowerCase() || "";
  pdfNames.set(filename, url);

  const base = pdfBaseName(filename);
  if (base) pdfBaseNames.push({ base, url });
}

pdfBaseNames.sort((a, b) => a.base.length - b.base.length);

function findMatchingPdf(v: Record<string, string>): string | null {
  const parts = [
    v.manufacturer || "",
    v.model || "",
    v.hoistVehicleVariant || "",
  ];
  const expected = parts.filter(Boolean).join(" ").toLowerCase().trim();
  if (!expected) return null;

  const exact = pdfNames.get(`${expected}.pdf`);
  if (exact) return exact;

  for (const { base, url } of pdfBaseNames) {
    if (base === expected || base.endsWith(` ${expected}`)) return url;
  }
  return null;
}

export const VEHICLES: Vehicle[] = (Array.isArray(json) ? json : []).map(
  (v: Record<string, string>, i: number) => ({
    ...v,
    id: i + 1,
    bootHoistPdf: findMatchingPdf(v),
  }),
) as Vehicle[];
