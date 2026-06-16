import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#EBEDEA] flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-6 max-w-350 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
