import { BackButton } from "../shared/BackButton";
import { useNavigate } from "react-router-dom";

interface LogEntry {
  id: number;
  timestamp: string;
  category: string;
}

const dummyLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: "2026-11-09T09:14:00",
    category: "Users",
  },
  /*   {
    id: 2,
    timestamp: "2026-11-09T10:02:00",
    category: "Users",
  },
  {
    id: 3,
    timestamp: "2026-11-09T10:35:00",
    category: "Users",
  },
  {
    id: 4,
    timestamp: "2026-11-09T11:20:00",
    category: "Users",
  }, */
];

// const logListHeader: string[] = ["Time", "category", "User", "Details"];

function formatTimestamp(isoDate: string): string {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) return isoDate;

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LogsScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          Logs
        </h1>
      </div>

      <div className="overflow-x-auto font-poppins">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              {["Time", "Category", ""].map((header) => (
                <th
                  className="text-left text-sm font-medium text-gray-900 py-3 px-4"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dummyLogs.map((log) => (
              <tr
                key={log.id}
                className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2]"
              >
                <td className="text-nowrap px-4 py-3">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="px-4 py-3">{log.category}</td>
                <td className="ml-auto px-4 py-3 text-base">
                  <p>
                    <b className="text-[#006B2D]">admin@test.com</b> created the
                    user <b className="text-[#006B2D]">user@test.com</b>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*  <br />
                    <b className="text-[#006B2D]">admin@test.com</b> deleted the
                    user <b className="text-[#006B2D]">user@test.com</b>
                    <br />
                    <b className="text-[#006B2D]">admin@test.com</b>{" "}
                    updated the data for <b className="text-[#006B2D]">Boot Hoist</b> */