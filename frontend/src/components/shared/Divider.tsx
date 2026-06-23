export default function Divider() {
  return (
    <div className="relative flex items-start w-full h-6">
      <div className="h-6 grow bg-[#E5E9E5]" />
      <div className="relative w-6 shrink-0 h-24 -mb-full">
        <div
          className="absolute inset-0 h-12 bg-[#E5E9E5]"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 50%)" }}
        />
        <div
          className="absolute inset-0 bg-[#A2AFA2] translate-x-0.5 translate-y-0.5"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0% 100%, 0% 24px" }}
        />
      </div>
    </div>
  );
}
