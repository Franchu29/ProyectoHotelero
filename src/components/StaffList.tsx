type Trabajador = {
  id: number;
  cantidad: number;
  montoUnitario: number;
  cargo?: { nombre: string };
  turno?: {
    inicio?: string;
    fin?: string;
  };
  tarifa?: {
    turno?: {
      inicio?: string;
      fin?: string;
    };
  };
  asignaciones?: {
    id: number;
    trabajador?: {
      id: number;
      nombres: string;
      apellidos: string;
      comuna?: { nombre: string };
    };
  }[];
};

type Props = {
  trabajadores: Trabajador[];
  onAssign?: (detalle: Trabajador) => void;
  canAssign?: boolean;
  assignHelpText?: string;
  onDownloadContract?: (asignacionId: number, workerName: string) => void;
  downloadingAssignmentId?: number | null;
};

export default function StaffList({
  trabajadores,
  onAssign,
  canAssign = true,
  assignHelpText,
  onDownloadContract,
  downloadingAssignmentId = null,
}: Props) {
  const formatTurnoLabel = (turno?: { inicio?: string; fin?: string }) => {
    if (!turno?.inicio || !turno?.fin) return "";

    const inicio = new Date(turno.inicio).toISOString().substring(11, 16);
    const fin = new Date(turno.fin).toISOString().substring(11, 16);

    return `${inicio} - ${fin}`;
  };

  const total = trabajadores.reduce(
    (acc, t) => acc + (t.cantidad || 0) * (t.montoUnitario || 0),
    0
  );

  return (
    <div className="bg-[#F8F6F2] rounded-2xl border border-[#E7E4DD] p-6">

      {/* LABEL */}
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-6">
        Detalle de trabajadores
      </h3>

      {trabajadores.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No hay trabajadores asignados
        </p>
      ) : (
        <div className="space-y-4">

          {trabajadores.map((t) => {
            const subtotal =
              (t.cantidad || 0) * (t.montoUnitario || 0);
            const asignados = t.asignaciones || [];
            const cuposRestantes = Math.max(
              (t.cantidad || 0) - asignados.length,
              0
            );

            return (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-white border border-[#E7E4DD] space-y-4"
              >
                <div className="flex justify-between items-center gap-4">
                  {/* LEFT */}
                  <div>
                    <p className="text-sm font-medium">
                      {t.cargo?.nombre || "-"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {formatTurnoLabel(t.turno) ||
                        formatTurnoLabel(t.tarifa?.turno) ||
                        "-"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Asignados: {asignados.length}/{t.cantidad || 0}
                    </p>
                  </div>

                  {/* CENTER */}
                  <div className="text-sm text-gray-500">
                    x{t.cantidad || 0}
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${subtotal.toLocaleString("es-CL")}
                    </p>

                    <p className="text-xs text-gray-400">
                      ${t.montoUnitario?.toLocaleString("es-CL")} c/u
                    </p>
                  </div>
                </div>

                {asignados.length > 0 && (
                  <div className="space-y-2">
                    {asignados.map((asignacion) => (
                      <div
                        key={asignacion.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-[#F8F6F2] px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {asignacion.trabajador?.nombres} {asignacion.trabajador?.apellidos}
                          </p>

                          <p className="text-xs text-gray-500">
                            {asignacion.trabajador?.comuna?.nombre || "Sin comuna"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                            Asignado
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onDownloadContract?.(
                                asignacion.id,
                                `${asignacion.trabajador?.nombres || ""} ${asignacion.trabajador?.apellidos || ""}`.trim()
                              )
                            }
                            disabled={!onDownloadContract || downloadingAssignmentId === asignacion.id}
                            className="rounded-lg border border-[#D6D0C4] bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-[#EFEAE1] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {downloadingAssignmentId === asignacion.id
                              ? "Generando..."
                              : "Descargar PDF"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => onAssign?.(t)}
                    disabled={!onAssign || cuposRestantes === 0 || !canAssign}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {!canAssign
                      ? "Bloqueado"
                      : cuposRestantes === 0
                      ? "Completo"
                      : `Asignar (${cuposRestantes})`}
                  </button>
                </div>

                {!canAssign && assignHelpText && (
                  <p className="text-xs text-amber-700">
                    {assignHelpText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TOTAL */}
      <div className="mt-6 text-right">
        <p className="text-sm text-gray-400">Total</p>
        <p className="text-xl font-serif">${total}</p>
      </div>
    </div>
  );
}
