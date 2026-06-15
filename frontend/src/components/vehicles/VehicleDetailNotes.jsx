export default function VehicleDetailNotes({ title, notes }) {
  return (
    <div className="divide-gray-100 border border-gray-200 rounded-lg p-4 font">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      {title && (
        <p className="text-base text-gray-600 mt-2 whitespace-pre-wrap">{notes || "—"}</p>
      )}
    </div>
  );
}
