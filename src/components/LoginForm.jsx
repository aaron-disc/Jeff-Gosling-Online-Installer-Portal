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
    <div className="bg-[#E5E9E5] rounded-2xl border border-gray-200 shadow-lg p-6 w-full max-w-lg">
      <div className="mx-5 my-10">
        <div className="flex flex-col items-center mb-6">
          <LogoGreen />
        </div>
        <div className="flex flex-col gap-3">
          <input
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] shadow-[0px_2.84568px_5.69136px_rgba(0,0,0,0.25)] rounded-[8.5px]"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <input
            type="password"
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] shadow-[0px_2.84568px_5.69136px_rgba(0,0,0,0.25)] rounded-[8.5px] mt-5"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="cursor-pointer text-md text-right hover:underline hover:text-[#006B2D]">
            Forgot Password
          </button>
          <button
            className="w-full bg-[#006B2D] hover:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] font-medium py-2.5 rounded-lg text-lg transition-colors cursor-pointer mt-5"
            onClick={onSubmit}
          >
            Login
          </button>
          <button className="cursor-pointer text-md text-center hover:underline hover:text-[#006B2D] mt-2">
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}

/*
<div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 leading-5">
          <span className="font-medium text-gray-700">Demo accounts:</span>
          <br />
          admin@accessparts.co.uk / admin123
          <br />
          installer@garageone.co.uk / install123
          <br />
          a@b.com / test
        </div>

*/
