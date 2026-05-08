export default function LeadCard() {
  return (
    <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6 space-y-4">
      <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
        Lead Assignment
      </p>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div>
          <p className="font-medium">Alessandro Moretti</p>
          <p className="text-sm text-gray-400">Lead Artisan</p>
        </div>
      </div>

      <button className="w-full border border-[#E7E4DD] py-2 rounded-xl text-sm hover:bg-[#EFECE6] transition">
        Change Lead Worker
      </button>
    </div>
  );
}