type Props = {
  comentario?: string;
};

export default function RequestSummaryCard({ comentario }: Props) {
  return (
    <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6">
      
      {/* LABEL */}
      <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-4">
        Resumen
      </p>

      {/* CONTENT */}
      <p className="text-sm text-gray-700 leading-relaxed italic">
        {comentario || "Sin comentario disponible"}
      </p>

    </div>
  );
}