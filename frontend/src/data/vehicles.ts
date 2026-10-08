import type { Vehicle } from "./types";

const API_BASE = `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}`;

const response = await fetch(`${API_BASE}/api/local-csv`);
const json = await response.json();

export const VEHICLES: Vehicle[] = (Array.isArray(json) ? json : []).map(
  (v: Record<string, string>, i: number) => ({
    ...v,
    id: i + 1,
  }),
) as Vehicle[];
