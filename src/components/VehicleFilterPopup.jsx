import { X } from "lucide-react";

export default function VehicleFilterPopup({ isOpen, onClose, filters, onFilterChange, vehicles }) {
  const manufacturers = [...new Set(vehicles.map(v => v.make))].sort();
  const models = filters.manufacturer 
    ? [...new Set(vehicles.filter(v => v.make === filters.manufacturer).map(v => v.model))].sort()
    : [];
  const designStatuses = [...new Set(vehicles.map(v => v.designStatus))].sort();

  const handleManufacturerChange = (e) => {
    onFilterChange({ ...filters, manufacturer: e.target.value, model: "" });
  };

  const handleClearFilters = () => {
    onFilterChange({ manufacturer: "", model: "", designStatus: "" });
  };

  const hasActiveFilters = filters.manufacturer || filters.model || filters.designStatus;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">
            Filter vehicles
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-[#006B2D]">
                ({[filters.manufacturer, filters.model, filters.designStatus].filter(Boolean).length} active)
              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
              value={filters.manufacturer}
              onChange={handleManufacturerChange}
            >
              <option value="">All manufacturers</option>
              {manufacturers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D] disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={filters.model}
              onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
              disabled={!filters.manufacturer}
            >
              <option value="">{filters.manufacturer ? "All models" : "Select manufacturer first"}</option>
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Design Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
              value={filters.designStatus}
              onChange={(e) => onFilterChange({ ...filters, designStatus: e.target.value })}
            >
              <option value="">All statuses</option>
              {designStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {hasActiveFilters && (
            <button
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
          <button
            className="flex-1 bg-[#006B2D] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#005824] cursor-pointer"
            onClick={onClose}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}