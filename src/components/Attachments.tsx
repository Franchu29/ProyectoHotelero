export default function Attachments() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">
        Attached Documentation
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FileCard name="Blueprint_EastWing_V4.pdf" size="12.4 MB" />
        <FileCard name="Marble_Spec_Sample.jpg" size="4.2 MB" />
      </div>
    </div>
  );
}

function FileCard({ name, size }: any) {
  return (
    <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition">
      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-400">{size}</p>
      </div>
    </div>
  );
}