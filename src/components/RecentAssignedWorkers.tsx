type WorkerAssignment = {
  id: number;
  nombres: string;
  apellidos: string;
  comuna?: string | null;
  cargo?: string | null;
  area?: string | null;
  solicitudId?: number | null;
  empresa?: string | null;
};

type Props = {
  workers: WorkerAssignment[];
  loading?: boolean;
};

export default function RecentAssignedWorkers({
  workers,
  loading = false,
}: Props) {
  return (
    <div className="bg-[#F8F6F2] rounded-2xl border border-[#E7E4DD] p-6">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-6">
        Detalle de trabajadores
      </h3>

      {loading ? (
        <p className="text-sm text-gray-400">
          Cargando trabajadores asignados...
        </p>
      ) : workers.length === 0 ? (
        <p className="text-sm text-gray-400">
          No hay trabajadores asignados recientemente
        </p>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => (
            <article
              key={worker.id}
              className="rounded-xl border border-[#E7E4DD] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1f2937]">
                    {worker.nombres} {worker.apellidos}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {worker.cargo || "Sin cargo"} · {worker.comuna || "Sin comuna"}
                  </p>
                </div>

                {worker.solicitudId ? (
                  <span className="rounded-full bg-[#F4EFE5] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8b6b31]">
                    Solicitud #{worker.solicitudId}
                  </span>
                ) : null}
              </div>

              {(worker.empresa || worker.area) && (
                <p className="mt-3 text-xs text-gray-400">
                  {worker.empresa || "Sin empresa"}{worker.area ? ` · ${worker.area}` : ""}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
