import { useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  CircleQuestionMark,
  EqualApproximately,
  Search,
  Pen,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import type { Vehicle } from "../../data/types";

interface StatusConfig {
  bg: string;
  text: string;
  icon: React.ComponentType<{ size?: number }>;
}

const getStatusConfig = (hoistStatus: string): StatusConfig => {
  switch (hoistStatus.toLowerCase()) {
    case "complete":
      return {
        bg: "bg-[#13A538]",
        text: "text-white",
        icon: Check,
      };
    case "to be designed":
      return {
        bg: "bg-[#F1C800]",
        text: "text-[#3D3900]",
        icon: Clock,
      };
    case "not possible":
      return {
        bg: "bg-[#575756]",
        text: "text-white",
        icon: X,
      };

    case "to be assessed":
      return {
        bg: "bg-[#b0b8AD]",
        text: "text-black",
        icon: CircleQuestionMark,
      };
    case "see notes":
      return {
        bg: "bg-[#00CCFF]",
        text: "text-[#575756]",
        icon: Pen,
      };
    case "investigation req":
      return {
        bg: "bg-[#E53E30]",
        text: "text-white",
        icon: Search,
      };
    case "assumed like":
      return {
        bg: "bg-[#e68702]",
        text: "text-white",
        icon: EqualApproximately,
      };
    default:
      return {
        bg: "bg-[#b0b8AD]",
        text: "text-[#575756]",
        icon: CircleQuestionMark,
      };
  }
};

type SortKey = "openingHeight" | "heightUnderSpreaderBar";

const getNextSortDirection = (current: string) => {
  switch (current) {
    case "none":
      return "desc";
    case "desc":
      return "asc";
    case "asc":
      return "none";
    default:
      return "none";
  }
};

const vehicleListHeader: string[] = [
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

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleList({ vehicles, onSelect }: VehicleListProps) {
  const [sortOpeningHeight, setSortOpeningHeight] = useState("none");
  const [sortHeightUnderSpreaderBar, setSortHeightUnderSpreaderBar] =
    useState("none");
  const [sortOrder, setSortOrder] = useState<SortKey[]>([]);

  console.log(sortOrder);

  const handleSortClick = (key: SortKey) => {
    const current =
      key === "openingHeight" ? sortOpeningHeight : sortHeightUnderSpreaderBar;
    const next = getNextSortDirection(current);

    if (key === "openingHeight") {
      setSortOpeningHeight(next);
    } else {
      setSortHeightUnderSpreaderBar(next);
    }

    setSortOrder((prev) => {
      if (next === "none") return prev.filter((k) => k !== key);
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  };

  const sortedVehicles = useMemo(() => {
    if (sortOrder.length === 0) {
      return vehicles;
    }

    const getValue = (vehicle: Vehicle, key: SortKey) =>
      key === "openingHeight"
        ? Number(vehicle.measurementE) || 0
        : Number(vehicle.measurementO) || 0;

    const getDirection = (key: SortKey) =>
      key === "openingHeight" ? sortOpeningHeight : sortHeightUnderSpreaderBar;

    return [...vehicles].sort((a, b) => {
      for (const key of sortOrder) {
        const result =
          getDirection(key) === "asc"
            ? getValue(a, key) - getValue(b, key)
            : getValue(b, key) - getValue(a, key);
        if (result !== 0) return result;
      }
      return 0;
    });
  }, [vehicles, sortOpeningHeight, sortHeightUnderSpreaderBar, sortOrder]);

  return (
    <>
      <div className="overflow-x-auto font-poppins">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              {vehicleListHeader.map((header, i) => {
                if (header === "Opening Height (mm)") {
                  return (
                    <th
                      className="text-left text-sm font-medium text-gray-900 py-3 px-4 hover:cursor-pointer"
                      key={i}
                      onClick={() => handleSortClick("openingHeight")}
                    >
                      <div className="flex gap-1">
                        {header}
                        {sortOpeningHeight === "desc" ? (
                          <ChevronDown className="size-5 shrink-0 self-center" />
                        ) : sortOpeningHeight === "asc" ? (
                          <ChevronUp className="size-5 shrink-0 self-center" />
                        ) : (
                          <ChevronsUpDown className="size-5 shrink-0 self-center" />
                        )}
                      </div>
                    </th>
                  );
                }

                if (header === "Height Under Spreader Bar (mm)") {
                  return (
                    <th
                      className="text-left text-sm font-medium text-gray-900 py-3 px-4 hover:cursor-pointer"
                      key={i}
                      onClick={() => handleSortClick("heightUnderSpreaderBar")}
                    >
                      <div className="flex gap-1">
                        {header}
                        {sortHeightUnderSpreaderBar === "desc" ? (
                          <ChevronDown className="size-5 shrink-0 self-center" />
                        ) : sortHeightUnderSpreaderBar === "asc" ? (
                          <ChevronUp className="size-5 shrink-0 self-center" />
                        ) : (
                          <ChevronsUpDown className="size-5 shrink-0 self-center" />
                        )}
                      </div>
                    </th>
                  );
                }

                return (
                  <th
                    className="text-left text-sm font-medium text-gray-900 py-3 px-4"
                    key={i}
                  >
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedVehicles.map((vehicle) => {
              const status = getStatusConfig(vehicle.hoistStatus);
              const StatusIcon = status.icon;
              return (
                <tr
                  key={vehicle.id}
                  tabIndex={0}
                  role="button"
                  className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2] cursor-pointer focus:outline-2 focus:outline-[#006B2D] focus:-outline-offset-2"
                  onClick={() => onSelect(vehicle)}
                  onKeyDown={(e: React.KeyboardEvent) => {
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
                      className={`min-w-35 inline-flex gap-1.5 text-xs px-2 py-1.5 rounded font-medium text-nowrap ${status.bg} ${status.text}`}
                    >
                      <StatusIcon size={14} />
                      <span className="text-center grow">
                        {vehicle.hoistStatus}
                      </span>
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
    </>
  );
}
