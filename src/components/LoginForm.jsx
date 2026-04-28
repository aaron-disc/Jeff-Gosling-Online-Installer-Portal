import { Lock } from "lucide-react";

import { LogoGreen } from "../svg/LogoGreen";
import { LogoYellow } from "../svg/LogoYellow";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 w-full max-w-sm">
      <div className="flex flex-col items-center mb-6">
        <LogoGreen />
      </div>
      <div className="flex flex-col gap-3">
        <input
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        <input
          type="password"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="w-full bg-[#006B2D] hover:bg-[#005824] text-white font-medium py-2.5 rounded-sm text-sm transition-colors"
          onClick={onSubmit}
        >
          Sign in
        </button>
      </div>
      <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 leading-5">
        <span className="font-medium text-gray-700">Demo accounts:</span>
        <br />
        admin@accessparts.co.uk / admin123
        <br />
        installer@garageone.co.uk / install123
        <br />
        a@b.com / test
      </div>
    </div>
  );
}
