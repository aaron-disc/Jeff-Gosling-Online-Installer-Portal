import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { fetchVehicles } from "../../data/vehicles";
import type { ListVehicle } from "../../data/types";
import { Funnel } from "lucide-react";

import { BackButton } from "../shared/BackButton";
import VehicleList from "../vehicles/VehicleList";
import VehicleFilterPopup from "../vehicles/VehicleFilterPopup";

interface VehicleFilters {
  manufacturer: string;
  model: string;
  designStatus: string[];
  maxVehicleLoad: string;
}

const STORAGE_KEY = "jgVehicleFilters";

function loadSavedFilters(): VehicleFilters | null {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    sessionStorage.removeItem(STORAGE_KEY);
    try {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.designStatus)) {
        return parsed as VehicleFilters;
      }
      // Backward compatibility for old format
      if (parsed && typeof parsed.designStatus === "string") {
        return {
          ...parsed,
          designStatus: parsed.designStatus ? [parsed.designStatus] : [],
        };
      }
      return parsed;
    } catch {
      /* */
    }
  }
  return null;
}

export default function VehicleSearchScreen() {
  const navigate = useNavigate();
  const { selectedProduct } = useAppContext();
  const [listState, setListState] = useState<{
    vehicles: ListVehicle[];
    error: string | null;
  } | null>(null);
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>(() => {
    const saved = loadSavedFilters();
    return (
      saved || {
        manufacturer: "",
        model: "",
        designStatus: [],
        maxVehicleLoad: "",
      }
    );
  });
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filterPopupKey, setFilterPopupKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchVehicles()
      .then((data) => {
        if (cancelled) return;
        setListState({ vehicles: data, error: null });
      })
      .catch(() => {
        if (cancelled) return;
        setListState({
          vehicles: [],
          error: "Unable to load vehicles. Please try again.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const vehicles = listState?.vehicles ?? [];
  const isLoadingVehicles = listState === null;
  const vehiclesError = listState?.error ?? null;

  const isFiltered =
    vehicleFilters.manufacturer ||
    vehicleFilters.model ||
    (vehicleFilters.designStatus && vehicleFilters.designStatus.length > 0) ||
    vehicleFilters.maxVehicleLoad !== "";

  const filteredVehicles = vehicles.filter(
    (v) =>
      (!vehicleFilters.manufacturer ||
        v.manufacturer === vehicleFilters.manufacturer) &&
      (!vehicleFilters.model || v.model === vehicleFilters.model) &&
      ((vehicleFilters.designStatus && vehicleFilters.designStatus.length === 0) ||
        vehicleFilters.designStatus.some(
          (status) => v.hoistStatus.toLowerCase() === status.toLowerCase(),
        )) &&
      (!vehicleFilters.maxVehicleLoad ||
        Number(v.maxVehicleLoad.replace(/\D/g, "")) ===
          Number(vehicleFilters.maxVehicleLoad)),
  );

  return (
    <div>
      <BackButton onClick={() => navigate("/products")} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          {selectedProduct?.label}
        </h1>
        <div className="md:pt-0 pt-4 pb-1.5 self-center ml-auto">
          <VehicleFilterPopup
            key={filterPopupKey}
            isOpen={filterPopupOpen}
            onClose={() => setFilterPopupOpen(false)}
            filters={vehicleFilters}
            onFilterChange={setVehicleFilters}
            vehicles={vehicles}
          />

          <button
            className={`md:w-100 lg:w-135 w-full ml-auto px-4 py-2.5 text-sm text-left flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded focus:outline-2 focus:outline-[#006B2D] ${isFiltered ? "outline-2 outline-[#006B2D]" : "outline outline-black"}`}
            onClick={() => {
              setFilterPopupOpen(true);
              setFilterPopupKey((k) => k + 1);
            }}
          >
            <span
              className={
                isFiltered ? "text-[#006B2D] font-medium" : "text-gray-600"
              }
            >
              Filter vehicles
            </span>
            <div className="flex items-center gap-2 ">
              {isFiltered && (
                <span className="bg-[#006B2D] text-white text-xs px-2 py-0.5 rounded">
                  {filteredVehicles.length}{" "}
                  {filteredVehicles.length === 1 ? "Vehicle" : "Vehicles"}
                </span>
              )}
              <span>
                <Funnel size={16} color="#1E2939" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {isLoadingVehicles ? (
        <p className="text-lg text-center mt-20 text-gray-600">
          Loading vehicles...
        </p>
      ) : vehiclesError ? (
        <p className="text-lg text-center mt-20 text-red-600">
          {vehiclesError}
        </p>
      ) : filteredVehicles.length > 0 ? (
        <VehicleList
          vehicles={filteredVehicles}
          onSelect={(vehicle) => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(vehicleFilters));
            window.scrollTo(0, 0);
            navigate(`/vehicles/${vehicle.id}`);
          }}
        />
      ) : (
        <p className="text-lg text-center mt-20 text-gray-600">
          No vehicles found.
        </p>
      )}
    </div>
  );
}
