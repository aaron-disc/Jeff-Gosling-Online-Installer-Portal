import { Check, X, Clock, AlertCircle, File } from "lucide-react";

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

export default function VehicleDetail({ vehicle, onViewPdf, onDownloadPdf }) {
  const status = getStatusConfig(vehicle.designStatus);
  const StatusIcon = status.icon;

  console.log(vehicle);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{vehicle.variant}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${status.bg} ${status.text}`}
        >
          <StatusIcon size={16} /> {vehicle.designStatus}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Vehicle details
        </h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {[
            ["Manufacturer", vehicle.make],
            ["Model", vehicle.model],
            ["Variant", vehicle.variant],
            ["Start", vehicle.start],
            ["End", vehicle.end || "—"],
            ["Design Status", vehicle.designStatus],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-gray-400">{label}</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {value || "N/A"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-4 flex gap-3">
        <button
          className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          onClick={onViewPdf}
        >
          <File size={16} /> View Installation Guide
        </button>
        <button
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          onClick={onDownloadPdf}
        >
          <File size={16} /> Download PDF
        </button>
      </div>
    </div>
  );
}
