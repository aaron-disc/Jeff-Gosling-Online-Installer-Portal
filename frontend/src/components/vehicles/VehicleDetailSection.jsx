import { Check, X } from "lucide-react";

export default function VehicleDetailSection({
  vehicleDetailArr,
  vehicle,
  title,
}) {
  //console.log(vehicle, vehicleDetailArr, vehicle[vehicleDetailArr[0].key]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      {title && (
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
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
                <span className="text-sm font-semibold text-gray-900 pr-2.5">
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
              <span
                className={`inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded font-medium ${
                  supported
                    ? "bg-[#13A538] text-white"
                    : "bg-gray-100 text-gray-800"
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
