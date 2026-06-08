import { Check, X } from "lucide-react";

export default function VehicleDetailSection({
  vehicleDetailArr,
  vehicle,
  title,
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {vehicleDetailArr.map(({ key, label }) => {
          const supported = vehicle[key]?.toLowerCase() === "yes";
          return (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-base text-gray-700">{label}</span>
              <span
                className={`inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-full font-medium ${
                  supported
                    ? "bg-[#13A538] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {supported ? <Check size={12} /> : <X size={12} />}
                {supported ? "Yes" : "No"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
