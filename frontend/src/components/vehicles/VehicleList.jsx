import { Check, X, Clock, CircleQuestionMark } from "lucide-react";

const getStatusConfig = (hoistProgress) => {
  switch (hoistProgress) {
    case "Complete":
      return {
        bg: "bg-[#13A538]",
        text: "text-white",
        icon: Check,
      };
    case "Not Possible":
      return {
        bg: "bg-[#575756]",
        text: "text-white",
        icon: X,
      };
    case "To Be Designed":
      return {
        bg: "bg-[#F1C800]",
        text: "text-[#3D3900]",
        icon: Clock,
      };
    case "To Be Assessed":
      return {
        bg: "bg-[#b0b8AD]",
        text: "text-[#575756]",
        icon: CircleQuestionMark,
      };
    default:
      return {
        bg: "bg-[#b0b8AD]",
        text: "text-[#575756]",
        icon: CircleQuestionMark,
      };
  }
};

const vehicleListHeader = [
  "Manufacturer",
  "Model",
  "Variant",
  "Start",
  "End",
  "Design Status",
  "Opening Height (mm)",
  "Height Under Spreader Bar (mm)",
  "Max Vehicle Load (kg)",
];

export default function VehicleList({ vehicles, onSelect }) {
  return (
    <>
      <div className="overflow-x-auto font-poppins">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              {vehicleListHeader.map((header, i) => (
                <th
                  className="text-left text-sm font-medium text-gray-900 py-3 px-4"
                  key={i}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => {
              const status = getStatusConfig(vehicle.hoistProgress);
              const StatusIcon = status.icon;
              return (
                <tr
                  key={vehicle.id}
                  tabIndex={0}
                  role="button"
                  className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2] cursor-pointer focus:outline-2 focus:outline-[#006B2D] focus:-outline-offset-2"
                  onClick={() => onSelect(vehicle)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(vehicle);
                    }
                  }}
                >
                  <td className="font-medium">{vehicle.manufacturer}</td>
                  <td className="xl:text-nowrap">{vehicle.model}</td>
                  <td className="xl:text-nowrap">
                    {vehicle.hoistVehicleVariant}
                  </td>
                  <td className="text-nowrap">{vehicle.minStartDate || "—"}</td>
                  <td className="text-nowrap">{vehicle.maxEndDate || "—"}</td>
                  <td>
                    <span
                      className={`w-32 inline-flex gap-1.5 text-xs px-2 py-1.5 rounded font-medium text-nowrap ${status.bg} ${status.text}`}
                    >
                      <StatusIcon size={14} />
                      <p className="text-center grow">{vehicle.hoistProgress}</p>
                    </span>
                  </td>
                  <td>{vehicle.measurementE || "—"}</td>
                  <td>{vehicle.measurementO || "—"}</td>
                  <td>{vehicle.maxVehicleLoad || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
{/* 
      <div className="lg:hidden font-poppins flex flex-col gap-3">
        {vehicles.map((vehicle) => {
          const status = getStatusConfig(vehicle.hoistProgress);
          const StatusIcon = status.icon;
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelect(vehicle)}
              className="w-full text-left bg-[#EBEDEA] rounded-lg p-4 hover:bg-[#e2e2e2] cursor-pointer focus:outline-2 focus:outline-[#006B2D]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {vehicle.manufacturer} {vehicle.model}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {vehicle.hoistVehicleVariant}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex gap-1 text-xs px-2 py-1 rounded font-medium ${status.bg} ${status.text}`}
                >
                  <StatusIcon size={12} />
                  <span>{vehicle.hoistProgress}</span>
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                <span>Start: {vehicle.minStartDate || "—"}</span>
                <span>End: {vehicle.maxEndDate || "—"}</span>
                {vehicle.measurementE && <span>Opening: {vehicle.measurementE}mm</span>}
                {vehicle.measurementO && <span>Under bar: {vehicle.measurementO}mm</span>}
                {vehicle.maxVehicleLoad && <span>Max load: {vehicle.maxVehicleLoad}kg</span>}
              </div>
            </button>
          );
        })}
      </div>
*/}
    </>
  );
}
