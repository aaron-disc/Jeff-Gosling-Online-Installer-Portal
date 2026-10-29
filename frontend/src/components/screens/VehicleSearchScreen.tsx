import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { fetchVehicles } from "../../data/vehicles";
import type { ListVehicle } from "../../data/types";
import { BackButton } from "../shared/BackButton";
import VehicleFilterPopup from "../vehicles/VehicleFilterPopup";
import VehicleList from "../vehicles/VehicleList";

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

  const filtersCount =
    +!!vehicleFilters.manufacturer +
    +!!vehicleFilters.model +
    +(vehicleFilters.designStatus.length > 0) +
    +(vehicleFilters.maxVehicleLoad !== "");

  const filteredVehicles = vehicles.filter(
    (v) =>
      (!vehicleFilters.manufacturer ||
        v.manufacturer === vehicleFilters.manufacturer) &&
      (!vehicleFilters.model || v.model === vehicleFilters.model) &&
      ((vehicleFilters.designStatus &&
        vehicleFilters.designStatus.length === 0) ||
        vehicleFilters.designStatus.some(
          (status) => v.hoistStatus.toLowerCase() === status.toLowerCase(),
        )) &&
      (!vehicleFilters.maxVehicleLoad ||
        Number(v.maxVehicleLoad?.replace(/\D/g, "")) ===
          Number(vehicleFilters.maxVehicleLoad)),
  );

  return (
    <div>
      <BackButton onClick={() => navigate("/products")} style="mb-2" />
      <div className="sm:flex sm:gap-6 sm:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          {selectedProduct?.label || "Boot Hoist"}
        </h1>
        <div className="sm:pt-0 pt-4 pb-1.5 self-center ml-auto">
          <button
            className=" bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-5 rounded transition-colors flex items-center justify-center gap-10 font-poppins cursor-pointer disabled:hover:cursor-not-allowed"
            onClick={() => {
              setFilterPopupOpen(true);
              setFilterPopupKey((k) => k + 1);
            }}
          >
            <span>Filter vehicles</span>

            <div className="flex items-center gap-2">
              <span className="relative">
                <SlidersHorizontal size={19} />
                {filtersCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#13A538] text-white text-xs rounded-full size-4 flex items-center justify-center ">
                    {filtersCount}
                  </span>
                )}
              </span>
            </div>
          </button>
          <VehicleFilterPopup
            key={filterPopupKey}
            isOpen={filterPopupOpen}
            onClose={() => setFilterPopupOpen(false)}
            filters={vehicleFilters}
            onFilterChange={setVehicleFilters}
            vehicles={vehicles}
          />
        </div>
      </div>

      {isLoadingVehicles ? (
        <p className="text-lg text-center mt-20 text-[#575756]">
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
        <p className="text-lg text-center mt-20 text-[#575756]">
          No vehicles found.
        </p>
      )}
    </div>
  );
}
