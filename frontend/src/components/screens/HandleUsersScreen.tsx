import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../shared/BackButton";
import UserList from "../users/UserList";
import CreateUserPopup, { type NewUser } from "../users/CreateUserPopup";
import DeleteUserPopup from "../users/DeleteUserPopup";

export interface User {
  email: string;
  is_admin: boolean;
  created_at: string;
  id: number;
}

interface ApiUser {
  email: string;
  is_admin: number | boolean;
  created_at: string;
  id: number;
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

export default function HandleUsersScreen() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [createUserPopupKey, setCreateUserPopupKey] = useState(0);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/users`,
      { signal },
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
          id: u.id,
        }))
      : [];

    setUsers(activeUsers);
    setError("");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setIsLoading(true);
        await loadUsers(controller.signal);
      } catch (err) {
        if (isAbortError(err)) return;
        setUsers([]);
        setError("Unable to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, [loadUsers]);

  const handleCreateUser = async ({ email, password, isAdmin }: NewUser) => {
    let response: Response;

    try {
      response = await fetch(
        `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/create-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, isAdmin }),
        },
      );
    } catch {
      throw new Error("Unable to reach the server. Please try again.");
    }

    if (!response.ok) {
      throw new Error("Error creating a new user. Please try again.");
    }

    try {
      await loadUsers();
    } catch {
      setError("User created, but the list could not be refreshed.");
    }
  };

  const handleDeleteUser = async ({ id }: { id: number }): Promise<void> => {
    let response: Response;

    try {
      response = await fetch(
        `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/delete-user/${id}`,
        { method: "DELETE" },
      );
    } catch {
      throw new Error("Unable to reach the server. Please try again.");
    }

    if (!response.ok) {
      throw new Error("Error deleting user. Please try again.");
    }

    setIsDeleteUserOpen(false);

    try {
      await loadUsers();
    } catch {
      setError("User deleted, but the list could not be refreshed.");
    }
  };

  const handleOpenDeleteUser = (user: User) => {
    setDeleteUserTarget(user);
    setIsDeleteUserOpen(true);
  };

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins ">
          Handle Users
        </h1>
        <div className="md:pt-0 pt-4 pb-1.5 self-center ml-auto">
          <CreateUserPopup
            key={createUserPopupKey}
            isOpen={isCreateUserOpen}
            onClose={() => setIsCreateUserOpen(false)}
            onCreate={handleCreateUser}
          />

          <DeleteUserPopup
            user={deleteUserTarget}
            isOpen={isDeleteUserOpen}
            onDeleteUser={handleDeleteUser}
            onClose={() => setIsDeleteUserOpen(false)}
          />

          {!isLoading && !error && (
            <button
              className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 font-poppins cursor-pointer"
              onClick={() => {
                setIsCreateUserOpen(true);
                setCreateUserPopupKey((k) => k + 1);
              }}
            >
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
        <UserList users={users} onOpenDeleteUser={handleOpenDeleteUser} />
      )}
    </div>
  );
}
