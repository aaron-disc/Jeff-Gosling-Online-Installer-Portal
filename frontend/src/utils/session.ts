import { apiFetch } from "./api";

export async function logoutSession(): Promise<void> {
  try {
    await apiFetch("/logout", { method: "POST" });
  } catch {
    return;
  }
}
