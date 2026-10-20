import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import type { ListVehicle } from "../../data/types";

interface VehicleFilters {
  manufacturer: string;
  model: string;
  designStatus: string[];
  maxVehicleLoad: string;
}

interface VehicleFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VehicleFilters;
  onFilterChange: (filters: VehicleFilters) => void;
  vehicles: ListVehicle[];
}

export default function VehicleFilterPopup({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  vehicles,
}: VehicleFilterPopupProps) {
  const [localFilters, setLocalFilters] = useState<VehicleFilters>({
    ...filters,
  });

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

  const handleClearFilters = () => {
    setLocalFilters({
      manufacturer: "",
      model: "",
      designStatus: [],
      maxVehicleLoad: "",
    });
    onFilterChange({
      manufacturer: "",
      model: "",
      designStatus: [],
      maxVehicleLoad: "",
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.manufacturer ||
    localFilters.model ||
    (localFilters.designStatus && localFilters.designStatus.length > 0) ||
    localFilters.maxVehicleLoad !== "";

  const designStatuses = [
    "Complete",
    "To Be Designed",
    "Not Possible",
    "To Be Assessed",
    "See Notes",
    "Investigation Req",
    "Assumed Like",
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6.5 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
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
                    localFilters.designStatus.length > 0,
                    localFilters.maxVehicleLoad !== "",
                  ].filter(Boolean).length
                }{" "}
                filters active)
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
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  manufacturer: e.target.value,
                  model: "",
                })
              }
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
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 justify-between items-center">
                Design Status
                {localFilters.designStatus.length > 0 && (
                  <button
                    className="font-normal text-sm flex gap-1 cursor-pointer items-center"
                    onClick={() => {
                      setLocalFilters({
                        ...localFilters,
                        designStatus: [],
                      });
                    }}
                  >
                    Clear Filter
                    <RotateCcw size={14}/>
                  </button>
                )}
              </label>
              <div className="space-y-2 overflow-y-auto border border-gray-300 rounded px-3 py-2.5">
                {designStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#006B2D] focus:ring-[#006B2D]"
                      checked={localFilters.designStatus.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLocalFilters({
                            ...localFilters,
                            designStatus: [
                              ...localFilters.designStatus,
                              status,
                            ],
                          });
                        } else {
                          setLocalFilters({
                            ...localFilters,
                            designStatus: localFilters.designStatus.filter(
                              (s) => s !== status,
                            ),
                          });
                        }
                      }}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
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
                  maxVehicleLoad:
                    e.target.value === "" ? "" : String(e.target.value),
                })
              }
            >
              <option value="">Any</option>
              {[100, 150].map((n) => (
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
              className="flex-1 outline outline-gray-300 text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-[#f3f4f6] cursor-pointer focus:bg-[#f3f4f6]"
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
