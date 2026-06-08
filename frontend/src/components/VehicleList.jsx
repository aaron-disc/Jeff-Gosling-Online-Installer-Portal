 import { Check, X, Clock, AlertCircle } from "lucide-react";

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
        bg: "bg-gray-400",
        text: "text-white",
        icon: X,
      };
    case "To Be Designed":
      return {
        bg: "bg-[#F1C800]",
        text: "text-[#3D3900]",
        icon: Clock,
      };
    case "To Be Assessed" : 
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: AlertCircle,
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-900",
        icon: AlertCircle,
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
  console.log(vehicles);

  return (
    <div className="overflow-x-auto">
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
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(vehicle)}
              >
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {vehicle.manufacturer}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.model}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.hoistVehicleVariant}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.minStartDate || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {vehicle.maxEndDate || "—"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${status.bg} ${status.text}`}
                  >
                    <StatusIcon size={14} /> {vehicle.hoistProgress}
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
