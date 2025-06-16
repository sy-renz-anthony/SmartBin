export default function CustomToolTip({ active, payload }) {
  if (active && payload && payload.length) {
    const { value } = payload[0];
    return (
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 shadow text-sm">
        <p className="text-gray-800 font-semibold">{payload[0].payload.payload._id}</p>
        <p className="text-blue-500">={value}</p>
      </div>
    );
  }
  return null;
}