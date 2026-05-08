import { useState } from "react";

type Props = {
  estadoActual?: string;
  onChange?: (nuevoEstado: string) => void;
};

export default function StatusCard({
  estadoActual,
  onChange,
}: Props) {
  const [estado, setEstado] = useState(estadoActual || "");

  const handleSave = () => {
    if (onChange) onChange(estado);
  };

  return (
    <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6 space-y-5">

      {/* LABEL */}
      <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
        Estado de la solicitud
      </p>

      {/* SELECT */}
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full bg-white border border-[#E7E4DD] rounded-lg p-2 text-sm"
      >
        <option value="pendiente">Pendiente</option>
        <option value="aprobado">Aprobado</option>
        <option value="rechazado">Rechazado</option>
      </select>

      {/* ACTION */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-gold to-premium text-white py-2 rounded-xl hover:opacity-90 transition"
      >
        Guardar cambio
      </button>
    </div>
  );
}