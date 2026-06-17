export default function VehicleDetailNotes({ title, notes }) {
  return (
    <div className="divide-gray-100 border border-gray-200 rounded-lg p-4">
      {title && <h3 className="text-lg font-medium text-[#1d1d1b]">{title}</h3>}
      <p className="text-base text-[#575756] mt-2 whitespace-pre-wrap">
        {notes || "N/A"}
      </p>
    </div>
  );
}
