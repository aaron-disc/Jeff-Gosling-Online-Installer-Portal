import { Check, X } from "lucide-react";

export default function VehicleDetailSection({
  vehicleDetailArr,
  vehicle,
  title,
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      {title && (
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#1d1d1b]">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {vehicleDetailArr.map(({ key, label }) => {
          const raw = vehicle[key];
          const bool =
            raw?.toLowerCase() === "yes" || raw?.toLowerCase() === "no";
          const yes = bool && raw.toLowerCase() === "yes"  

          return (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-base text-gray-700">{label}</span>
              {bool ? (
                <span className={`inline-flex items-center gap-1 text-sm px-2.5 py-1 font-medium ${yes ? "text-[#13A538]" : "text-red-500"}`}>
                  {yes ? <Check size={16} /> : <X size={16} />}
                  {yes ? "Yes" : "No"}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-900 px-2.5 text-nowrap">
                  {raw || "—"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
