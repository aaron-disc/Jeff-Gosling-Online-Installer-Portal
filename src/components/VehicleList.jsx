import { Check, X, Clock, AlertCircle } from "lucide-react";

const getStatusConfig = (designStatus) => {
  switch (designStatus) {
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
        text: "text-[#3D3500]",
        icon: Clock,
      };
    case "Assumed like Other (see notes)":
    case "See Notes":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: AlertCircle,
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-500",
        icon: AlertCircle,
      };
  }
};

export default function VehicleList({ vehicles, onSelect }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              Manufacturer
            </th>
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              Model
            </th>
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              Variant
            </th>
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              Start
            </th>
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              End
            </th>
            <th className="text-left text-sm font-medium text-gray-500 py-3 px-4">
              Design Status
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const status = getStatusConfig(v.designStatus);
            const StatusIcon = status.icon;

            return (
              <tr
                key={v.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(v)}
              >
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {v.make}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{v.model}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{v.variant}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {v.start || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {v.end || "—"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${status.bg} ${status.text}`}
                  >
                    <StatusIcon size={14} /> {v.designStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
