import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { VEHICLES } from "../../data/vehicles";
import { BackButton } from "../shared/BackButton";
import VehicleList from "../vehicles/VehicleList";
import VehicleFilterPopup from "../vehicles/VehicleFilterPopup";

export default function VehicleSearchScreen() {
  const navigate = useNavigate();
  const { selectedProduct } = useAppContext();
  const [vehicleFilters, setVehicleFilters] = useState({
    manufacturer: "",
    model: "",
    maxVehicleLoad: 1000,
  });
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filterPopupKey, setFilterPopupKey] = useState(0);

  const filteredVehicles = VEHICLES.filter(
    (v) =>
      (!vehicleFilters.manufacturer ||
        v.manufacturer === vehicleFilters.manufacturer) &&
      (!vehicleFilters.model || v.model === vehicleFilters.model) &&
      (!v.maxVehicleLoad ||
        Number(v.maxVehicleLoad) <= vehicleFilters.maxVehicleLoad),
  );

  return (
    <div>
      <BackButton onClick={() => navigate("/products")} style="mb-4" />
      <div className="min-[1280px]:flex min-[1280px]:items-start min-[1280px]:justify-between min-[1280px]:gap-6 mb-5">
        <div className="min-[1280px]:flex-1">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            {selectedProduct?.label}
          </h1>
          <p className="text-sm text-gray-500">
            Find your customer&apos;s vehicle to view fitting instructions.
          </p>
        </div>
        <div className="xl:w-160 xl:pt-0 pt-4 self-end">
          <VehicleFilterPopup
            key={filterPopupKey}
            isOpen={filterPopupOpen}
            onClose={() => setFilterPopupOpen(false)}
            filters={vehicleFilters}
            onFilterChange={setVehicleFilters}
            vehicles={VEHICLES}
          />

          <button
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-left flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setFilterPopupOpen(true);
              setFilterPopupKey((k) => k + 1);
            }}
          >
            <span
              className={
                vehicleFilters.manufacturer ||
                vehicleFilters.model ||
                vehicleFilters.maxVehicleLoad < 1000
                  ? "text-[#006B2D] font-medium"
                  : "text-gray-600"
              }
            >
              Filter vehicles
            </span>
            <div className="flex items-center gap-2">
              {(vehicleFilters.manufacturer ||
                vehicleFilters.model ||
                vehicleFilters.maxVehicleLoad < 1000) && (
                <span className="bg-[#006B2D] text-white text-xs px-1.5 py-0.5 rounded">
                  {[
                    vehicleFilters.manufacturer,
                    vehicleFilters.model,
                    vehicleFilters.maxVehicleLoad < 1000,
                  ].filter(Boolean).length}
                </span>
              )}
              <span className="text-gray-400">↓</span>
            </div>
          </button>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <VehicleList
          vehicles={filteredVehicles}
          onSelect={(vehicle) => navigate(`/vehicles/${vehicle.id}`)}
        />
      ) : (
        <p className="text-sm text-gray-400">No vehicles found.</p>
      )}
    </div>
  );
}
