import { useState } from "react";
import { X } from "lucide-react";
import type { Vehicle } from "../../data/types";

interface VehicleFilters {
  manufacturer: string;
  model: string;
  maxVehicleLoad: string;
}

interface VehicleFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VehicleFilters;
  onFilterChange: (filters: VehicleFilters) => void;
  vehicles: Vehicle[];
}

export default function VehicleFilterPopup({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  vehicles,
}: VehicleFilterPopupProps) {
  const [localFilters, setLocalFilters] = useState<VehicleFilters>({ ...filters });

  const manufacturers = [
    ...new Set(vehicles.map((v) => v.manufacturer)),
  ].sort();
  const models = localFilters.manufacturer
    ? [
        ...new Set(
          vehicles
            .filter((v) => v.manufacturer === localFilters.manufacturer)
            .map((v) => v.model),
        ),
      ].sort()
    : [];

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters({
      ...localFilters,
      manufacturer: e.target.value,
      model: "",
    });
  };

  const handleClearFilters = () => {
    setLocalFilters({ manufacturer: "", model: "", maxVehicleLoad: "" });
    onFilterChange({ manufacturer: "", model: "", maxVehicleLoad: "" });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.manufacturer ||
    localFilters.model ||
    localFilters.maxVehicleLoad !== "";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">
            Filter vehicles
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-[#006B2D]">
                (
                {
                  [
                    localFilters.manufacturer,
                    localFilters.model,
                    localFilters.maxVehicleLoad !== "",
                  ].filter(Boolean).length
                }{" "}
                active)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
              value={localFilters.manufacturer}
              onChange={handleManufacturerChange}
            >
              <option value="">All manufacturers</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D] disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={localFilters.model}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, model: e.target.value })
              }
              disabled={!localFilters.manufacturer}
            >
              <option value="">
                {localFilters.manufacturer
                  ? "All models"
                  : "Select manufacturer first"}
              </option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Vehicle Load (kg)
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D] disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={localFilters.maxVehicleLoad}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  maxVehicleLoad: e.target.value === "" ? "" : String(e.target.value),
                })
              }
            >
              <option value="">Any</option>
              {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6 font-poppins">
          {hasActiveFilters && (
            <button
              className="flex-1 outline outline-gray-300 text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-gray-50 cursor-pointer"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
          <button
            className="flex-1 bg-[#006B2D] text-white py-2.5 rounded text-sm font-medium hover:bg-[#005824] cursor-pointer"
            onClick={handleApply}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
