import { useState } from "react";
import { X } from "lucide-react";

export default function VehicleFilterPopup({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  vehicles,
}) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

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

  const handleManufacturerChange = (e) => {
    setLocalFilters({
      ...localFilters,
      manufacturer: e.target.value,
      model: "",
    });
  };

  const handleClearFilters = () => {
    setLocalFilters({ manufacturer: "", model: "", maxVehicleLoad: 1000 });
    onFilterChange({ manufacturer: "", model: "", maxVehicleLoad: 1000 });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.manufacturer ||
    localFilters.model ||
    localFilters.maxVehicleLoad < 1000;

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
                    localFilters.maxVehicleLoad < 1000,
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
              Max Vehicle Load: {localFilters.maxVehicleLoad} kg
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">0</span>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={localFilters.maxVehicleLoad}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxVehicleLoad: Number(e.target.value),
                  })
                }
                className="w-full accent-[#006B2D]"
              />
              <span className="text-xs text-gray-400">1000</span>
            </div>
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
