 export default function ProgressCard() {
  return (
    <div className="bg-dark text-white rounded-2xl p-6 space-y-4">
      <p className="text-sm text-gray-300">
        This contract is currently 40% complete.
      </p>

      <div className="w-full bg-gray-700 h-2 rounded-full">
        <div className="bg-gradient-to-r from-gold to-premium h-2 rounded-full w-[40%]" />
      </div>

      <p className="text-xs text-gray-400 tracking-wide">
        MILESTONE PROGRESS
      </p>
    </div>
  );
}