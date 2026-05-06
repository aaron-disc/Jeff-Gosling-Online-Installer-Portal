import { Search, ChevronLeft } from "lucide-react";

export default function VehicleSearch({ search, onSearch }) {
  return (
    <div className="relative mb-5">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search size={16} />
      </div>
      <input
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D] bg-white"
        placeholder="Search by manufacturer or model..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

export function BackButton({ onClick }) {
  return (
    <button
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
      onClick={onClick}
    >
      <ChevronLeft size={20}/> Back
    </button>
  );
}