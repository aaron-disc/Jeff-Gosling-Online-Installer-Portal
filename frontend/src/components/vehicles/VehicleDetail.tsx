import {
  Check,
  X,
  Clock,
  CircleQuestionMark,
  FileDown,
  FileSearchCorner,
} from "lucide-react";

import type { Vehicle } from "../../data/types";
import VehicleDetailSection from "./VehicleDetailSection";
import VehicleDetailNotes from "./VehicleDetailNotes";

interface StatusConfig {
  bg: string;
  text: string;
  icon: React.ComponentType<{ size?: number }>;
}

const getStatusConfig = (hoistProgress: string): StatusConfig => {
  switch (hoistProgress) {
    case "Complete":
      return {
        bg: "bg-[#13A538]",
        text: "text-[#13A538]",
        icon: Check,
      };
    case "Not Possible":
      return {
        bg: "bg-[#575756]",
        text: "text-[#575756]",
        icon: X,
      };
    case "To Be Designed":
      return {
        bg: "bg-[#F1C800]",
        text: "text-[#F1C800]",
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
        bg: "bg-gray-100",
        text: "text-gray-900",
        icon: CircleQuestionMark,
      };
  }
};

interface VehicleDetailProps {
  vehicle: Vehicle;
  onViewPdf?: () => void;
  onDownloadPdf: () => void;
}

export default function VehicleDetail({
  vehicle,
  onViewPdf,
  onDownloadPdf,
}: VehicleDetailProps) {
  const status = getStatusConfig(vehicle.hoistProgress);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 ">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-[30px] font-semibold text-black">
            {vehicle.manufacturer} {vehicle.model}
          </h2>
          <p className="text-base text-gray-500 mt-1">
            {vehicle.hoistVehicleVariant}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-base px-3 py-1.5 rounded font-medium shrink-0 ${status.text}`}
        >
          <StatusIcon size={16} /> {vehicle.hoistProgress}
        </span>
      </div>

      <div className="relative pt-4 border-t border-[#EBEDEA]">
        <dl className="grid grid-cols-3 sm:grid-cols-5 justify-items-center gap-x-6 gap-y-4 text-center">
          {(
            [
              ["Manufacturer", vehicle.manufacturer],
              ["Model", vehicle.model],
              ["Variant", vehicle.hoistVehicleVariant],
              ["Start", vehicle.minStartDate],
              ["End", vehicle.maxEndDate],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="text-[13px] sm:text-[13px] md:text-sm text-gray-400">
                {label}
              </dt>
              <dd className="text-[15px] sm:text-[15px] md:text-base text-gray-900 font-medium">
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="md:mt-8 mt-4">
          {!vehicle.bootHoistPdf && (
            <p className="mb-2 text-center text-gray-700">
              * No pdf available *
            </p>
          )}
          <div className="flex max-[500px]:flex-col gap-3">
            <button
              className={`flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-[11px] sm:text-[13px] md:text-[15px] font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2 font-poppins ${vehicle.bootHoistPdf ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={onViewPdf}
              disabled={vehicle.bootHoistPdf === null}
            >
              <FileSearchCorner size={18} /> View Installation Guide
            </button>
            <button
              className={`flex-1 outline outline-gray-300 hover:bg-gray-50 text-gray-700 text-[11px] sm:text-[13px] md:text-[15px] font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2 font-poppins ${vehicle.bootHoistPdf ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={onDownloadPdf}
              disabled={vehicle.bootHoistPdf === null}
            >
              <FileDown size={18} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#EBEDEA] pt-4 mt-7 flex flex-col gap-4">
        <VehicleDetailNotes
          notes={vehicle.fittingNotes}
          title="Overview Notes"
        />
        <h2 className="mt-3 text-2xl px-3 font-medium">Hoist Design Details</h2>
        <VehicleDetailSection
          vehicleDetailArr={[
            { key: "engineICE" as const, label: "ICE" },
            { key: "engineFullEV" as const, label: "Full EV" },
            { key: "engineHEV" as const, label: "HEV" },
            { key: "engineMHEV" as const, label: "MHEV" },
            { key: "enginePHEV" as const, label: "PHEV" },
          ]}
          vehicle={vehicle}
          title="Suitable for Engine Type"
        />
        <VehicleDetailSection
          vehicleDetailArr={[
            {
              key: "maxVehicleLoad" as const,
              label: "Max Vehicle Load",
            },
            { key: "hoistSide" as const, label: "Hoist Side" },
            { key: "aframe" as const, label: "A-Frame Type" },
            {
              key: "hingePostYoke" as const,
              label: "Standard Hinge Post Yoke Position",
            },
            {
              key: "upDownActuatorStroke" as const,
              label: "Up/Down Actuator Stroke",
            },
          ]}
          vehicle={vehicle}
          title="Setup Details"
        />
        <h2 className="text-2xl font-medium mt-8 px-3">
          Vehicle Measurements and Details
        </h2>

        <div className="mt-3">
          <p className="text-red-500 text-left pl-3">
            All measurements provided are approximate. We would always recommend
            checking measurements and key information such as seating
            arrangements as these details can change on specification and
            mid-life facelifts. All measurements are given in mm.
          </p>
          <VehicleDetailSection
            vehicleDetailArr={[
              { key: "measurementE" as const, label: "Opening Height" },
              { key: "measurementD" as const, label: "Opening Width" },
              {
                key: "measurementI" as const,
                label: "Height of Boot Lip from Ground",
              },
            ]}
            vehicle={vehicle}
          />
        </div>

        <VehicleDetailNotes title="Seat Notes" notes={vehicle.seatNotes} />
        <VehicleDetailSection
          vehicleDetailArr={[
            { key: "splitSeats" as const, label: "Split Seats" },
            {
              key: "measurementK1" as const,
              label: "Depth without seats folded",
            },
            {
              key: "measurementN" as const,
              label: "Depth with seats folded",
            },
            {
              key: "depthWithSeatsSlidForward" as const,
              label: "Depth without seats folded but slid forwards",
            },
            {
              key: "2ndRowSeatsFoldedLipToFloor" as const,
              label: "Lip from boot floor to folded seats",
            },
          ]}
          vehicle={vehicle}
          title="Second Row"
        />
        <VehicleDetailSection
          vehicleDetailArr={[
            {
              key: "measurementK2" as const,
              label: "Depth without seats folded",
            },
            {
              key: "3rdRowSeatsFoldedLipToFloor" as const,
              label: "Lip from boot floor to folded seats",
            },
            {
              key: "3rdRowOptions" as const,
              label: "Third row use when hoist fitted",
            },
          ]}
          vehicle={vehicle}
          title="Third Row"
        />
        <div>
          <VehicleDetailNotes
            title="False Floor Notes"
            notes={vehicle.falseFloorNotes}
          />
          <VehicleDetailSection
            vehicleDetailArr={[
              {
                key: "bootFloorToBootLip" as const,
                label: "Boot lip from boot floor opening",
              },
            ]}
            vehicle={vehicle}
          />
        </div>

        <div className="max-lg:flex-col flex lg:gap-6">
          <div>
            <VehicleDetailNotes
              title="Installed Hoist Measurements"
              notes="These setup notes are with the boot hoist setup at an average position for guidance. As the hoist arm is adjustable, you may achieve different measurements."
            />
            <VehicleDetailSection
              vehicleDetailArr={[
                {
                  key: "measurementO" as const,
                  label: "O: Height Under Spreader Bar",
                },
                {
                  key: "measurementP" as const,
                  label: "P: Upper arm to side of boot",
                },
                {
                  key: "measurementQ" as const,
                  label: "Q: Lower arm to side of boot",
                },
                {
                  key: "measurementR" as const,
                  label: "R: Length of arm",
                },
                {
                  key: "heightEndArmToGround" as const,
                  label:
                    "Height of end of arm to ground with arm fully out and down",
                },
              ]}
              vehicle={vehicle}
            />
          </div>
          <img
            src="../src/images/Dimensions.png"
            alt="Vehicle Boot Dimensions"
            className="object-cover my-5 sm:max-w-104 sm:max-h-80 self-center"
          />
        </div>
      </div>
    </div>
  );
}
