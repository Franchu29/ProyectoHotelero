type Props = {
  id: number;
  titulo?: string;
  estado?: string;
  fechaActualizacion?: string;
};

export default function RequestHero({
  id,
  titulo,
  estado,
  fechaActualizacion,
}: Props) {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getStatusStyle = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-700";
      case "rechazado":
        return "bg-red-100 text-red-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-[#E8C98F] text-[#5A3E1B]";
    }
  };

  return (
    <div className="space-y-4">

      {/* ID */}
      <p className="text-[11px] tracking-[0.3em] text-gray-400">
        SOLICITUD: CR-{id}
      </p>

      {/* TITULO */}
      <h1 className="font-serif text-4xl">
        {titulo || "Sin título"}
      </h1>

      {/* STATUS + META */}
      <div className="flex items-center gap-4 flex-wrap">

        <span
          className={`text-[10px] px-3 py-1 rounded-full tracking-[0.2em] ${getStatusStyle(
            estado
          )}`}
        >
          {estado?.toUpperCase() || "SIN ESTADO"}
        </span>

        <span className="text-sm text-gray-400">
          Última actualización: {formatDate(fechaActualizacion)}
        </span>

      </div>
    </div>
  );
}