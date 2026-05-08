import { useEffect, useState } from "react";

type Props = {
  estadoActual?: string;     // para mostrar label
  estadoActualId?: number;   // para lógica real (ID)
  onChangeEstado?: (estadoId: number) => void;
};

export default function RequestActionsPanel({
  estadoActual,
  estadoActualId,
  onChangeEstado,
}: Props) {

  const [estado, setEstado] = useState<number>(estadoActualId || 0);

  // 🔄 sincronizar cuando cambia desde el padre
  useEffect(() => {
    setEstado(estadoActualId || 0);
  }, [estadoActualId]);

  const getStatusStyle = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "aprobada":
        return "bg-green-100 text-green-700";
      case "rechazada":
        return "bg-red-100 text-red-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "en revisión":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="space-y-6 sticky top-10">

      {/* STATUS CARD */}
      <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6 space-y-4">
        
        <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
          Estado actual
        </p>

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            estadoActual
          )}`}
        >
          {estadoActual || "Sin estado"}
        </span>

        {/* SELECT POR ID */}
        <select
          value={estado}
          onChange={(e) => setEstado(Number(e.target.value))}
          className="w-full bg-white border border-[#E7E4DD] rounded-lg p-2 text-sm"
        >
          <option value={1}>Pendiente</option>
          <option value={2}>En revisión</option>
          <option value={3}>Aprobada</option>
          <option value={4}>Rechazada</option>
          <option value={5}>Cancelada</option>
        </select>

        <button
          onClick={() => onChangeEstado?.(estado)}
          className="w-full bg-gradient-to-r from-gold to-premium text-white py-2 rounded-xl hover:opacity-90 transition"
        >
          Guardar cambio
        </button>
      </div>
    </div>
  );
}
