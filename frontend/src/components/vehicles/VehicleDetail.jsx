import { Check, X, Clock, AlertCircle, FileDown, FileSearchCorner } from "lucide-react";

import VehicleDetailSection from "./VehicleDetailSection";
import VehicleDetailNotes from "./VehicleDetailNotes";

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
        text: "text-[#3D3500]",
        icon: Clock,
      };
    case "To Be Assessed":
      return {
        bg: "bg-gray-100",
        text: "text-white",
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
  const status = getStatusConfig(vehicle.hoistProgress);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle.manufacturer} {vehicle.model}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {vehicle.hoistVehicleVariant}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded font-medium shrink-0 ${status.bg} ${status.text}`}
        >
          <StatusIcon size={16} /> {vehicle.hoistProgress}
        </span>
      </div>

      <div className="relative pt-4 border-t border-t-[#006B2D]">
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {[
            ["Manufacturer", vehicle.manufacturer],
            ["Model", vehicle.model],
            ["Variant", vehicle.hoistVehicleVariant],
            ["Start", vehicle.minStartDate],
            ["End", vehicle.maxEndDate || "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-gray-400">{label}</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {value || "N/A"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-gray-100 pt-4 mt-4 flex gap-3">
          <button
            className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-sm font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer font-poppins"
            onClick={onViewPdf}
          >
            <FileSearchCorner size={16} /> View Installation Guide
          </button>
          <button
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer font-poppins"
            onClick={onDownloadPdf}
          >
            <FileDown size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-4">
        <div>
          <VehicleDetailNotes notes={vehicle.fittingNotes} title="Notes" />
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "engineICE", label: "ICE" },
              { key: "engineFullEV", label: "Full EV" },
              { key: "engineHEV", label: "HEV" },
              { key: "engineMHEV", label: "MHEV" },
              { key: "enginePHEV", label: "PHEV" },
            ]}
            vehicle={vehicle}
            title="Engine"
          />
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "hoistSide", label: "Hoist Side" },
              { key: "aframe", label: "A-Frame Type" },
              {
                key: "hingePostYoke",
                label: "Standard Hinge Post Yoke Position",
              },
              {
                key: "upDownActuatorStroke",
                label: "Up/Down Actuator Stroke",
                type: "value",
              },
            ]}
            vehicle={vehicle}
          />
          <p className="mt-3 px-4 text-red-500">
            All measurements provided are approximate. We would always recommend
            checking measurements and key information such as seating
            arrangements as these details can change on specification and
            mid-life facelifts. All measurements are given in mm.
          </p>
          <VehicleDetailSection
            vehicleDetailArr={[
              {
                key: "maxVehicleLoad",
                label: "Max Vehicle Load",
                type: "value",
              },
              { key: "measurementE", label: "Opening Height", type: "value" },
              { key: "measurementD", label: "Opening Width", type: "value" },
              {
                key: "measurementI",
                label: "Height of Boot Lip from Ground",
                type: "value",
              },
            ]}
            vehicle={vehicle}
          />
        </div>

        <div className="mt-8">
          <VehicleDetailNotes title="Seats" notes={vehicle.seatNotes} />
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "splitSeats", label: "Split Seats" },
              {
                key: "measurementK1",
                label: "Depth without seats folded",
                type: "value",
              },
              {
                key: "measurementN",
                label: "Depth with seats folded",
                type: "value",
              },
              {
                key: "depthWithSeatsSlidForward",
                label: "Depth without seats folded but slid forwards",
                type: "value",
              },
              {
                key: "_2ndRowSeatsFoldedLipToFloor",
                label: "Lip from boot floor to folded seats",
                type: "value",
              },
            ]}
            vehicle={vehicle}
            title="Second Row"
          />
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "measurementK2", label: "Depth without seats folded", type: "value" },
              {
                key: "_3rdRowSeatsFoldedLipToFloor",
                label: "Lip from boot floor to folded seats",
                type: "value",
              },
              {
                key: "_3rdRowOptions",
                label: "Third row use when hoist fitted",
                type: "value",
              },
            ]}
            vehicle={vehicle}
            title="Third Row"
          />
        </div>
        <div className="mt-8">
          <VehicleDetailNotes
            title="False Floor Notes"
            notes={vehicle.falseFloorNotes}
          />
          <VehicleDetailSection
            vehicleDetailArr={[
              {
                key: "bootFloorToBootLip",
                label: "Boot lip from boot floor opening",
                type: "value",
              },
            ]}
            vehicle={vehicle}
          />
        </div>
        <div className="mt-8">
          <VehicleDetailNotes
            title="Setup"
            notes="These setup notes are with the boot hoist setup at an average position for guidance. As the hoist arm is adjustable, you may achieve different measurements."
          />
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "measurementO", label: "O: Height Under Spreader Bar", type: "value" },
              { key: "measurementP", label: "P: Upper arm to side of boot", type: "value" },
              { key: "measurementQ", label: "Q: Lower arm to side of boot", type: "value" },
              { key: "measurementR", label: "R: Length of arm", type: "value" },
              {
                key: "heightEndArmToGround",
                label:
                  "Height of end of arm to ground with arm fully out and down",
                type: "value",
              },
            ]}
            vehicle={vehicle}
          />
          <img src="../src/images/Dimensions.png" alt="Vehicle Boot Dimensions" className="object-cover mt-2"/>
        </div>
      </div>
    </div>
  );
}
