import type { ListVehicle, Vehicle } from "./types";
import { apiFetch } from "../utils/api";

export async function fetchVehicles(): Promise<ListVehicle[]> {
  const response = await apiFetch("/hoists-list");

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = await response.json();

  return (Array.isArray(json) ? json : []).map(
    (v: Record<string, string>) => ({
      id: Number(v.boot_hoist_id),
      manufacturer: v.manufacturer,
      model: v.model,
      hoistVehicleVariant: v.hoist_vehicle_variant,
      minStartDate: v.min_start_date,
      maxEndDate: v.max_end_date,
      hoistStatus: v.hoist_status,
      measurementE: v.measurement_e,
      measurementO: v.measurement_o,
      maxVehicleLoad: v.max_vehicle_load,
    }),
  ) as ListVehicle[];
}

function extractRow(json: unknown): Record<string, unknown> | null {
  // The endpoint responds with a mysql2 result, so the row(s) may be wrapped.
  const payload =
    Array.isArray(json) && Array.isArray(json[0]) ? json[0] : json;
  const row = Array.isArray(payload) ? payload[0] : payload;

  if (!row || typeof row !== "object") return null;
  return row as Record<string, unknown>;
}

function toVehicle(raw: Record<string, unknown>): Vehicle {
  return {
    id: Number(raw.boot_hoist_id),
    manufacturer: raw.manufacturer,
    model: raw.model,
    hoistVehicleVariant: raw.hoist_vehicle_variant,
    minStartDate: raw.min_start_date,
    maxEndDate: raw.max_end_date,
    hoistStatus: raw.hoist_status,
    measurementE: raw.measurement_e,
    measurementO: raw.measurement_o,
    maxVehicleLoad: raw.max_vehicle_load,
    engineICE: raw.engine_ice,
    engineFullEV: raw.engine_full_ev,
    engineHEV: raw.engine_hev,
    engineMHEV: raw.engine_mhev,
    enginePHEV: raw.engine_phev,
    hoistSide: raw.hoist_side,
    aframe: raw.a_frame,
    hingePostYoke: raw.hinge_post_yoke,
    upDownActuatorStroke: raw.up_down_actuator_stroke,
    measurementD: raw.measurement_d,
    measurementI: raw.measurement_i,
    seatNotes: raw.seat_notes,
    splitSeats: raw.split_seats,
    measurementK1: raw.measurement_k1,
    measurementN: raw.measurement_n,
    depthWithSeatsSlidForward: raw.depth_with_seats_slid_forward,
    "2ndRowSeatsFoldedLipToFloor": raw["2nd_row_seats_folded_to_floor"],
    measurementK2: raw.measurement_k2,
    "3rdRowSeatsFoldedLipToFloor": raw["3rd_row_seats_folded_lip_to_floor"],
    "3rdRowOptions": raw["3rd_row_options"],
    bootFloorToBootLip: raw.boot_floor_to_boot_lip,
    measurementP: raw.measurement_p,
    measurementQ: raw.measurement_q,
    measurementR: raw.measurement_r,
    heightEndArmToGround: raw.height_end_arm_to_ground,
    fittingNotes: raw.fitting_notes,
    falseFloorNotes: raw.false_floor_notes,
    hoistFittingPDFFileName: raw.hoist_fitting_pdf_filename,
  } as Vehicle;
}

export async function fetchVehicle(id: string): Promise<Vehicle> {
  const response = await apiFetch(`/hoist/${id}`);
  const json = await response.json();
  const raw = extractRow(json);

  if (!response.ok) {
    throw new Error(
      typeof raw?.error === "string"
        ? raw.error
        : `Request failed with status ${response.status}`,
    );
  }

  if (!raw) {
    throw new Error("Vehicle not found.");
  }

  return toVehicle(raw);
}
