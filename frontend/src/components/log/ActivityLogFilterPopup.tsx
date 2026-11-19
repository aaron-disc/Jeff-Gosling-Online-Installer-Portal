import { useState } from "react";
import { X } from "lucide-react";

export interface ActivityLogFilters {
  category: string;
  actor: string;
  startDate: string;
  endDate: string;
}

interface ActivityLog {
  category: string;
  event_actor: string;
}

interface ActivityLogFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ActivityLogFilters;
  onFilterChange: (filters: ActivityLogFilters) => void;
  logs: ActivityLog[];
}

const emptyFilters: ActivityLogFilters = {
  category: "",
  actor: "",
  startDate: "",
  endDate: "",
};

export default function ActivityLogFilterPopup({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  logs,
}: ActivityLogFilterPopupProps) {
  const [localFilters, setLocalFilters] = useState<ActivityLogFilters>({
    ...filters,
  });

  if (!isOpen) return null;

  const categories = [
    ...new Set([...logs.map((log) => log.category)]),
  ].sort();
  const actors = [...new Set(logs.map((log) => log.event_actor))].sort();

  const activeFilterCount = Object.values(localFilters).filter(Boolean).length;

  const updateFilter = (key: keyof ActivityLogFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleClearFilters = () => {
    setLocalFilters({ ...emptyFilters });
    onFilterChange({ ...emptyFilters });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6.5 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">
            Filter activity
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm text-[#006B2D]">
                ({activeFilterCount} filters active)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-black hover:text-[#13A538] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="activity-category"
            >
              Category
            </label>
            <select
              id="activity-category"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#13A538]"
              value={localFilters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="activity-actor"
            >
              Actor
            </label>
            <select
              id="activity-actor"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#13A538]"
              value={localFilters.actor}
              onChange={(event) => updateFilter("actor", event.target.value)}
            >
              <option value="">All actors</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="activity-start-date"
              >
                Start date
              </label>
              <input
                id="activity-start-date"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#13A538]"
                value={localFilters.startDate}
                onChange={(event) =>
                  updateFilter("startDate", event.target.value)
                }
              />
            </div>

            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="activity-end-date"
              >
                End date
              </label>
              <input
                id="activity-end-date"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#13A538]"
                value={localFilters.endDate}
                onChange={(event) =>
                  updateFilter("endDate", event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 font-poppins">
          {activeFilterCount > 0 && (
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
