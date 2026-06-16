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
                className="text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2] cursor-pointer focus:outline-2 focus:outline-[#006B2D] focus:-outline-offset-2"
                onClick={() => onSelect(vehicle)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(vehicle);
                  }
                }}
              >
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {vehicle.manufacturer}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 xl:text-nowrap">
                  {vehicle.model}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 xl:text-nowrap">
                  {vehicle.hoistVehicleVariant}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-nowrap">
                  {vehicle.minStartDate || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-nowrap">
                  {vehicle.maxEndDate || "—"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`w-32 inline-flex items-left gap-1.5 text-xs px-2 py-1.5 rounded font-medium text-nowrap ${status.bg} ${status.text}`}
                  >
                    <StatusIcon size={14} />{" "}
                    <p className="">{vehicle.hoistProgress}</p>
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.measurementE || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.measurementO || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.maxVehicleLoad || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
