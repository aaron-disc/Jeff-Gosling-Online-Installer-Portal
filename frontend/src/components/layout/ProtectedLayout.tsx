import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setLastRoute } from "../../utils/lastRoute";
import Header from "./Header";

export default function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    setLastRoute(`${location.pathname}${location.search}${location.hash}`);
  }, [location, user]);

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
