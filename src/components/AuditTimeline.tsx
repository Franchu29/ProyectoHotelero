type HistorialItem = {
  id: number;
  fecha: string;
  comentario?: string;
  estado?: {
    nombre: string;
  };
  usuario?: {
    nombre: string;
  };
};

type Props = {
  historial?: HistorialItem[];
};

export default function AuditTimeline({ historial = [] }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">
        Historial de la solicitud
      </h2>

      <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6 space-y-6">

        {historial.length === 0 && (
          <p className="text-sm text-gray-400">
            Sin movimientos registrados
          </p>
        )}

        {historial.map((item) => (
          <TimelineItem
            key={item.id}
            estado={item.estado?.nombre}
            usuario={item.usuario?.nombre}
            fecha={item.fecha}
            comentario={item.comentario}
          />
        ))}

      </div>
    </div>
  );
}

function TimelineItem({ estado, usuario, fecha, comentario }: any) {
  const getColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "aprobada":
        return "bg-green-500";
      case "rechazada":
        return "bg-red-500";
      case "pendiente":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex justify-between items-start">
      
      <div className="flex gap-3">
        
        {/* DOT */}
        <div className={`w-2 h-2 mt-2 rounded-full ${getColor(estado)}`} />

        <div>
          <p className="font-medium text-sm">
            Estado: {estado || "Sin estado"}
          </p>

          <p className="text-xs text-gray-400">
            por {usuario || "Sistema"}
          </p>

          {comentario && (
            <p className="text-xs text-gray-500 mt-1">
              {comentario}
            </p>
          )}
        </div>

      </div>

      <p className="text-xs text-gray-400">
        {new Date(fecha).toLocaleString()}
      </p>

    </div>
  );
}