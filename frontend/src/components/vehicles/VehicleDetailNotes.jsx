export default function VehicleDetailNotes({ title, notes }) {
  return (
    <div className="divide-gray-100 border border-gray-200 rounded-lg p-4 font">
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-base text-gray-600 whitespace-pre-wrap">{notes}</p>
    </div>
  );
}
