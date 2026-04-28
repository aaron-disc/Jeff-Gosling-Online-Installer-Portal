import { Check } from "lucide-react";

export default function VehicleList({ vehicles, onSelect }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
    >
      {vehicles.map((v) => (
        <button
          key={v.id}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow text-left w-full cursor-pointer"
          onClick={() => onSelect(v)}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {v.make} {v.model}
              </p>
              <p className="text-xs text-gray-500">
                {v.year} &middot; {v.body}
              </p>
            </div>
            {v.hoistType ? (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#F1C800] text-[#3D3500] font-medium flex-shrink-0">
                <Check size={16} /> {v.hoistType}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium flex-shrink-0">
                N/A
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div>
              <span className="text-gray-400">Engine</span>
              <p className="text-gray-700 font-medium truncate">{v.engine}</p>
            </div>
            <div>
              <span className="text-gray-400">Fuel</span>
              <p className="text-gray-700 font-medium">{v.fuel}</p>
            </div>
            <div>
              <span className="text-gray-400">Seats</span>
              <p className="text-gray-700 font-medium">{v.seats}</p>
            </div>
            <div>
              <span className="text-gray-400">Boot</span>
              <p className="text-gray-700 font-medium">{v.bootSpace}</p>
            </div>
            <div>
              <span className="text-gray-400">CO2</span>
              <p className="text-gray-700 font-medium">{v.co2}</p>
            </div>
            <div>
              <span className="text-gray-400">Drive</span>
              <p className="text-gray-700 font-medium">{v.drivetrain}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}