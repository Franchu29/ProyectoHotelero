import StatsCard from "./StatsCard";

type Solicitud = {
  id: number;
  comentario?: string;
  fechaFin?: string;
  montoTotal?: number;
  estado?: {
    nombre: string;
  };
};

type Props = {
  solicitud: Solicitud;
};

export default function ContractSpecification({ solicitud }: Props) {
  if (!solicitud) return <p>Cargando...</p>;

  return (
    <div className="bg-[#F8F6F2] border border-[#E7E4DD] rounded-2xl p-6 space-y-4">
      
      <h2 className="font-serif text-xl">
        Solicitud #{solicitud.id}
      </h2>

      <p className="text-gray-500">
        {solicitud.comentario || "Sin comentario"}
      </p>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <StatsCard 
          title="Estado" 
          value={solicitud.estado?.nombre || "Sin estado"} 
        />
        <StatsCard 
          title="Fecha fin" 
          value={
            solicitud.fechaFin
              ? new Date(solicitud.fechaFin).toLocaleDateString()
              : "Sin fecha"
          } 
        />
        <StatsCard 
          title="Monto" 
          value={`$${solicitud.montoTotal ?? 0}`} 
        />
      </div>
    </div>
  );
}