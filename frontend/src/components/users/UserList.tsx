import type { User } from "../../data/users";

const userListHeader: string[] = ["Email", "Role", "Added"];

function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
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
          {users.map((user) => (
            <tr
              key={user.email}
              className="text-[14px] text-left border-b border-gray-200 bg-[#EBEDEA] hover:bg-[#e2e2e2]"
            >
              <td className="font-medium">{user.email}</td>
              <td>
                  <span className="text-center grow">
                    {user.is_admin ? "Admin" : "User"}
                  </span>
              </td>
              <td className="text-nowrap">{formatDate(user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}