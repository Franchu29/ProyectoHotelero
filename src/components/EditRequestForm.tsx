import { useState } from "react";
import api from "../api/axios";

type EditFormProps = {
  data: any;
  onSave: (updated: any) => void;
  onClose: () => void;
};

export function EditRequestForm({ data, onSave, onClose }: EditFormProps) {
  const [comentario, setComentario] = useState(data.comentario || "");
  const [monto, setMonto] = useState(data.monto || 0);
  const [estado, setEstado] = useState(data.estado?.nombre || "pendiente");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { comentario, monto, estado };

    const res = await api.put(`/solicitudes/${data.id}`, payload);

    onSave(res.data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Editar solicitud</h2>

      <input
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Comentario"
      />

      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="pendiente">Pendiente</option>
        <option value="aprobado">Aprobado</option>
        <option value="rechazado">Rechazado</option>
      </select>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose}>
          Cancelar
        </button>

        <button className="bg-black text-white px-4 py-2 rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}