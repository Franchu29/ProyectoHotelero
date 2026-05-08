export default function PrioritySelector() {
  const options = ["Low", "Standard", "High", "Executive"];

  return (
    <div className="space-y-2">
      <p className="text-xs tracking-wide text-gray-500 uppercase">
        Service Priority Level
      </p>

      <div className="grid grid-cols-4 gap-4">
        {options.map((opt, i) => (
          <button
            key={opt}
            className={`py-3 rounded-xl border text-sm
              ${i === 1
                ? "border-[--color-gold] text-black"
                : "border-[#E7E4DD] text-gray-500"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}