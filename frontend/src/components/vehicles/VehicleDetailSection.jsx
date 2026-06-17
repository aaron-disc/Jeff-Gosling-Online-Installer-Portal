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
        {vehicleDetailArr.map(({ key, label, type = "boolean" }) => {
          const raw = vehicle[key];

          if (type === "value") {
            return (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-base text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-gray-900 px-2.5">
                  {raw || "—"}
                </span>
              </div>
            );
          }

          const supported = raw?.toLowerCase() === "yes";
          return (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-base text-gray-800">{label}</span>
              {/* <span
                className={`inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded font-medium text-white ${
                  supported
                    ? "bg-[#13A538]"
                    : "bg-[#575756]"
                }`}
              >
                {supported ? <Check size={16} /> : <X size={16} />}
                {supported ? "Yes" : "No"}
              </span> */}
              <span
                className={`inline-flex items-center gap-1 text-sm px-2.5 py-1 font-medium ${
                  supported ? "text-[#13A538]" : "text-red-500"
                }`}
              >
                {supported ? <Check size={16} /> : <X size={16} />}
                {supported ? "Yes" : "No"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
