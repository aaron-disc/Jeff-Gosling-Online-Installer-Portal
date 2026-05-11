import { LogoGreen } from "../../svg/LogoGreen";
import { LogoYellow } from "../../svg/LogoYellow";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  onSubmit,
  onRequestAccess,
}) {
  return (
    <div className="bg-[#E5E9E5] rounded-2xl border border-gray-200 shadow-lg p-6 w-full max-w-lg">
      <div className=" mx-5 my-10">
        <div className="flex flex-col items-center mb-6">
          <LogoGreen />
        </div>
        <div className="flex flex-col gap-3">
          <input
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] rounded-[8.5px] shadow-[0px_3px_5.5px_rgba(0,0,0,0.25)] focus:shadow-none focus:border-black focus:border-1 focus:outline-none focus:ring-1 text-base"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            id="hi"
          />
          <input
            type="password"
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] rounded-[8.5px] shadow-[0px_3px_5.5px_rgba(0,0,0,0.25)] focus:shadow-none focus:border-black focus:border-1 focus:outline-none focus:ring-1  mt-5"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-auto text-md self-end hover:underline hover:text-[#006B2D] cursor-pointer">
            Forgot Password
          </button>

          <button
            className="w-full py-2.5 mt-5 bg-[#006B2D] hover:bg-[#F1C800] focus:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] focus:text-[#006B2D] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer text-xl font-[Poppins]"
            onClick={onSubmit}
          >
            Login
          </button>
          <button
            className="px-10 w-fit text-md self-center hover:underline hover:text-[#006B2D] mt-3 cursor-pointer"
            onClick={onRequestAccess}
          >
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}
