import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../data/users";
import { BackButton } from "../shared/BackButton";
import UserList from "../users/UserList";

interface ApiUser {
  email: string;
  is_admin: number | boolean;
  created_at: string;
}

export default function HandleUsersScreen() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/users`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        const activeUsers: User[] = Array.isArray(data)
          ? data.map((u: ApiUser) => ({
              email: u.email,
              is_admin: u.is_admin === true || u.is_admin === 1,
              created_at: u.created_at,
            }))
          : [];

        setUsers(activeUsers);
        setError("");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setUsers([]);
        setError("Unable to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, []);

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins ">
          Handle Users
        </h1>
        <div className="md:pt-0 pt-4 pb-1.5 self-center ml-auto">
          {!isLoading && !error && (
            <button className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 font-poppins cursor-pointer">
              Create User
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-lg text-center mt-20 text-gray-600">
          Loading users...
        </p>
      ) : error ? (
        <p className="text-lg text-center mt-20 text-red-600">{error}</p>
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
}
