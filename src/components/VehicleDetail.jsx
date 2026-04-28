import { Check, File } from "lucide-react";

export default function VehicleDetail({ vehicle, onViewPdf, onDownloadPdf }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {vehicle.year} &middot; {vehicle.variant}
          </p>
        </div>
        {vehicle.hoistType ? (
          <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-[#F1C800] text-[#3D3500] font-medium flex-shrink-0">
            <Check size={16}/> {vehicle.hoistType} Compatible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 font-medium flex-shrink-0">
            No Hoist Available
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Vehicle specifications
        </h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {[
            ["Engine", vehicle.engine],
            ["Transmission", vehicle.transmission],
            ["Fuel Type", vehicle.fuel],
            ["Body Style", vehicle.body],
            ["Seats", vehicle.seats],
            ["Drivetrain", vehicle.drivetrain],
            ["Boot Space", vehicle.bootSpace],
            ["CO2 Emissions", vehicle.co2],
            ["MPG", vehicle.mpg],
            ...(vehicle.hoistType ? [["Hoist Type", vehicle.hoistType]] : []),
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-gray-400">{label}</dt>
              <dd className="text-sm text-gray-900 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {vehicle.hoistType && (
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
      )}
    </div>
  );
}