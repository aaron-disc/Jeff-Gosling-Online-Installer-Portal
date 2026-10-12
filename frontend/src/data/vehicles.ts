import type { Vehicle } from "./types";
import { apiFetch } from "../utils/api";

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await apiFetch("/api/local-csv");

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = await response.json();

  return (Array.isArray(json) ? json : []).map(
    (v: Record<string, string>, i: number) => ({
      ...v,
      id: i + 1,
    }),
  ) as Vehicle[];
}
