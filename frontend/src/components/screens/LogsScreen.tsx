import { useEffect, useState } from "react";
import { BackButton } from "../shared/BackButton";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

interface Log {
  event_logs_id: number;
  category: string;
  event_actor: string;
  event_action: string;
  event_target: string;
  created_at: string;
}

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

function LogDescription({ log }: { log: Log }) {
  switch (log.category.toLowerCase()) {
    case "users":
      return (
        <p className="text-base">
          <b className="text-[#006B2D]">{log.event_actor}</b> {log.event_action}{" "}
          the user <b className="text-[#006B2D]">{log.event_target}</b>
        </p>
      );
    case "data":
      return (
        <p className="text-base">
          <b className="text-[#006B2D]">{log.event_actor}</b> {log.event_action}{" "}
          the data for <b className="text-[#006B2D]">{log.event_target}</b>
        </p>
      );
    case "pdfs":
      return (
        <p className="text-base">
          <b className="text-[#006B2D]">{log.event_actor}</b> {log.event_action}{" "}
          the pdf instructions for{" "}
          <b className="text-[#006B2D]">{log.event_target}</b>
        </p>
      );
    default:
      return (
        <p className="text-base">
          unknown log : {log?.event_actor} - {log?.event_target}
        </p>
      );
  }
}

export default function LogsScreen() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLogs() {
      try {
        const response = await apiFetch("/logs", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setLogs(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Unable to fetch logs:", error);
      }
    }

    fetchLogs();

    return () => controller.abort();
  }, []);

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
              {["Time", "Category"].map((header) => (
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
            {logs.map((log) => (
              <tr
                key={log.event_logs_id}
                className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2]"
              >
                <td className="text-nowrap px-4 py-3">
                  {formatTimestamp(log.created_at)}
                </td>
                <td className="px-4 py-3">{log.category}</td>
                <td className="px-4 py-3 text-nowrap">
                  <LogDescription log={log} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
