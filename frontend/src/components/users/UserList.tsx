import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import type { User } from "../screens/HandleUsersScreen";

const userListHeader: string[] = ["Email", "Role", "Added"];

interface UserListProps {
  users: User[];
  onOpenDeleteUser: (user: User) => void;
}

export default function UserList({ users, onOpenDeleteUser }: UserListProps) {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto font-poppins">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            {userListHeader.map((header) => (
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
          {users.map((u) => (
            <tr
              key={u.email}
              className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2]"
            >
              <td className="font-medium">{u.email}</td>
              <td>
                <span className="text-center grow">
                  {u.is_admin ? "Admin" : "User"}
                </span>
              </td>
              <td className="text-nowrap">{formatDate(u.created_at)}</td>
              <td className="px-4 text-right">
                {/* sort data cell being shorter if no bin button */}
                {u.email !== "a@b.com" && u.email !== user?.email && (
                  <button
                    onClick={() => onOpenDeleteUser(u)}
                    className="text-[#ff2934] hover:text-[#fd121e] cursor-pointer"
                    aria-label={`Delete ${u.email}`}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
