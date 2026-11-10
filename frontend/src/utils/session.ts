const API_BASE = `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}`;

const TOKEN_KEY = "jgAuthToken";

export type SessionEndReason = "logout" | "timeout" | "closed";

export interface SessionRecord {
  userSessionsId: number;
  userEmail: string;
  loginAt: string;
  logoutAt: string;
  durationSeconds: number;
  endReason: SessionEndReason | "unknown";
}

export async function endSession(
  reason: SessionEndReason,
  token: string | null = localStorage.getItem(TOKEN_KEY),
): Promise<SessionRecord | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/session/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
      keepalive: true,
    });

    if (!response.ok) return null;

    return (await response.json()) as SessionRecord;
  } catch {
    return null;
  }
}
