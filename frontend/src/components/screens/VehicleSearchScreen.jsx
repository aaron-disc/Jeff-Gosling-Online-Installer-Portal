import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { VEHICLES } from "../../data/vehicles";
import { Funnel } from "lucide-react";

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

  const isFiltered =
    vehicleFilters.manufacturer ||
    vehicleFilters.model ||
    vehicleFilters.maxVehicleLoad < 1000;

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
      <div className="lg:flex lg:gap-6 lg:mb-5">
        <div className="">
          <h1 className="text-2xl font-medium text-gray-900 mb-1 font-poppins">
            {selectedProduct?.label}
          </h1>
          <p className="text-[16px] text-gray-500 font-century-gothic">
            Find your customer's vehicle to view fitting instructions.
          </p>
        </div>
        <div className=" lg:pt-0 pt-4 pb-1.5 self-end ml-auto">
          <VehicleFilterPopup
            key={filterPopupKey}
            isOpen={filterPopupOpen}
            onClose={() => setFilterPopupOpen(false)}
            filters={vehicleFilters}
            onFilterChange={setVehicleFilters}
            vehicles={VEHICLES}
          />

          <button
            className={`lg:w-135 w-full ml-auto px-4 py-2.5 text-sm text-left flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded focus:outline-2 focus:outline-[#006B2D] ${isFiltered ? "outline-2 outline-[#006B2D]" : "outline outline-black"}`}
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
                  {filteredVehicles.length > 1 ? "Vehicles" : "Vehicle"}
                </span>
              )}
              <span>
                <Funnel size={16} color="#1E2939" />
              </span>
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
