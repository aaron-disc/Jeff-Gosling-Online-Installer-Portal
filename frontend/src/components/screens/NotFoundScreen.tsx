import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLastRoute } from "../../utils/lastRoute";
import { Loader2 } from "lucide-react";

const REDIRECT_DELAY_MS = 5000;

export default function NotFoundScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const destination = user ? getLastRoute() : "/login";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate(destination, { replace: true });
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [destination, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#006B2D] font-poppins">
      <main
        role="alert"
        className="w-full max-w-lg rounded-2xl bg-[#F1C800] p-10 text-center shadow-lg"
      >
        <p aria-hidden="true" className="text-7xl font-bold text-[#006B2D]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-[#006B2D]">
          Page not found
        </h1>
        <p className="mt-3 text-lg text-[#006B2D]">
          {user
            ? "The page you are looking for doesn't exist. Taking you back to where you were."
            : "The page you are looking for doesn't exist. Taking you to the login page."}
          <span className="inline-block ml-2 translate-y-1">
            <Loader2 className="animate-spin" />
          </span>
        </p>

        <button
          type="button"
          className="mt-6 rounded bg-[#006B2D] px-6 py-2.5 text-[15px] font-medium text-[#F1C800] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13A538] cursor-pointer"
          onClick={() => navigate(destination, { replace: true })}
        >
          {user ? "Go back now" : "Go to login now"}
        </button>
      </main>
    </div>
  );
}
