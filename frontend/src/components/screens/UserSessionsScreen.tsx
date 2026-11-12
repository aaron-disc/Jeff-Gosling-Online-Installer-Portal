import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { BackButton } from "../shared/BackButton";

interface Session {
  user_sessions_id: number;
  user_email: string;
  login_at: string;
  logout_at?: string;
  duration_seconds?: number;
  end_reason: string;
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

function FormatSeconds({ totalSeconds }: { totalSeconds: number }) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <p>
      {hours > 0 && <b className="text-[#006B2D]">{hours}</b>}{" "}
      {hours === 1 ? "hour and" : hours > 1 ? "hours and" : ""}{" "}
      {totalSeconds < 60 ? (
        <b className="text-[#006B2D]">1</b>
      ) : (
        <b className="text-[#006B2D]">{minutes}</b>
      )}{" "}
      {totalSeconds < 60 ? "minute" : "minutes"}
    </p>
  );
}

export default function UserSessionsScreen() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSessions() {
      try {
        const response = await apiFetch("/sessions", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setSessions(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Unable to fetch logs:", error);
      }
    }

    fetchSessions();

    return () => controller.abort();
  }, []);

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          User Sessions
        </h1>
      </div>

      <div className="overflow-x-auto font-poppins">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              {[
                "Email",
                "Login At",
                "Logout At",
                "Session Length",
                "Session End Reason",
              ].map((header) => (
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
            {sessions.map((session) => (
              <tr
                key={session.user_sessions_id}
                className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2]"
              >
                <td className="px-4 py-3">{session.user_email}</td>
                <td className="text-nowrap px-4 py-3">
                  {formatTimestamp(session.login_at)}
                </td>
                <td className="text-nowrap px-4 py-3">
                  {session?.logout_at && formatTimestamp(session.logout_at)}
                </td>
                <td className="px-4 py-3">
                  {session?.duration_seconds && (
                    <FormatSeconds totalSeconds={session?.duration_seconds} />
                  )}
                </td>
                <td className="px-4 py-3">{session?.end_reason}</td>
                <td className="px-4 py-3"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
