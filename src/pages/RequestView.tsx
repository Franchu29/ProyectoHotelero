import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import AppLayout from "../components/layout/AppLayout";
import RequestHero from "../components/RequestHero";
import RequestMetaGrid from "../components/RequestMetaGrid";
import RequestSummaryCard from "../components/RequestSummaryCard";
import StaffList from "../components/StaffList";
import RequestActionsPanel from "../components/RequestActionsPanel";
import AuditTimeline from "../components/AuditTimeline";
import { Modal } from "../components/Modal";

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
      cargoPrincipal?: {
        nombre: string;
        area?: { nombre: string };
      };
    };
  }[];
};

export default function RequestView() {
  const { id } = useParams();

  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetalle, setSelectedDetalle] = useState<Trabajador | null>(null);
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [modalError, setModalError] = useState("");
  const [downloadingAssignmentId, setDownloadingAssignmentId] = useState<number | null>(null);

  const canAssignWorkers = solicitud?.estadoId === 2;
  const assignBlockedMessage =
    solicitud?.estadoId === 1
      ? "La solicitud debe pasar a En revision antes de asignar trabajadores."
      : "Solo se pueden asignar trabajadores cuando la solicitud está en En revision.";

  const fetchSolicitud = async () => {
    try {
      const res = await api.get(`/solicitudes/${id}`);
      setSolicitud(res.data);
    } catch (error) {
      console.error("Error cargando solicitud", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSolicitud();
  }, [id]);

  const handleChangeEstado = async (estadoId: number) => {
    try {
      const res = await api.put(`/solicitudes/${solicitud.id}/estado`, {
        estadoId,
      });

      setSolicitud(res.data);
    } catch (error) {
      console.error("Error cambiando estado", error);
    }
  };

  const closeAssignModal = () => {
    setSelectedDetalle(null);
    setAvailableWorkers([]);
    setSelectedWorkerIds([]);
    setModalError("");
  };

  const handleOpenAssignModal = async (detalle: Trabajador) => {
    if (!id) return;
    if (!canAssignWorkers) return;

    setSelectedDetalle(detalle);
    setSelectedWorkerIds([]);
    setModalError("");
    setModalLoading(true);

    try {
      const res = await api.get(
        `/solicitudes/${id}/detalle/${detalle.id}/trabajadores-disponibles`
      );

      setAvailableWorkers(res.data.trabajadores || []);
    } catch (error: any) {
      console.error("Error cargando trabajadores disponibles", error);
      setAvailableWorkers([]);
      setModalError(
        error.response?.data?.error ||
          "No se pudieron cargar los trabajadores disponibles"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleWorker = (workerId: number) => {
    if (!selectedDetalle) return;

    const maxSelectable = Math.max(
      (selectedDetalle.cantidad || 0) -
        (selectedDetalle.asignaciones?.length || 0),
      0
    );

    setSelectedWorkerIds((prev) => {
      if (prev.includes(workerId)) {
        return prev.filter((id) => id !== workerId);
      }

      if (prev.length >= maxSelectable) {
        return prev;
      }

      return [...prev, workerId];
    });
  };

  const handleAssignWorkers = async () => {
    if (!id || !selectedDetalle || selectedWorkerIds.length === 0) return;

    setAssigning(true);
    setModalError("");

    try {
      await api.post(
        `/solicitudes/${id}/detalle/${selectedDetalle.id}/asignaciones`,
        {
          trabajadorIds: selectedWorkerIds,
        }
      );

      closeAssignModal();
      await fetchSolicitud();
    } catch (error: any) {
      console.error("Error asignando trabajadores", error);
      setModalError(
        error.response?.data?.error || "No se pudieron guardar las asignaciones"
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleDownloadContract = async (asignacionId: number, workerName: string) => {
    if (!id) return;

    setDownloadingAssignmentId(asignacionId);

    try {
      const response = await api.get(
        `/solicitudes/${id}/asignaciones/${asignacionId}/contrato-pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeWorkerName =
        workerName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || `asignacion-${asignacionId}`;

      link.href = url;
      link.download = `contrato-${id}-${safeWorkerName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando contrato", error);
      window.alert("No se pudo descargar el PDF del contrato.");
    } finally {
      setDownloadingAssignmentId(null);
    }
  };

  // 🔹 loading
  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  // 🔹 null safety
  if (!solicitud) {
    return <div className="p-6">No se encontró la solicitud</div>;
  }

  // 🔹 data segura
  const trabajadores: Trabajador[] = solicitud.trabajadores || [];

  const formatTurnoLabel = (turno?: { inicio?: string; fin?: string }) => {
    if (!turno?.inicio || !turno?.fin) return "";

    const inicio = new Date(turno.inicio).toISOString().substring(11, 16);
    const fin = new Date(turno.fin).toISOString().substring(11, 16);

    return `${inicio} - ${fin}`;
  };

  const turnos = Array.from(
    new Set(
      trabajadores
        .map(
          (trabajador) =>
            formatTurnoLabel(trabajador.turno) ||
            formatTurnoLabel(trabajador.tarifa?.turno)
        )
        .filter(Boolean)
    )
  ).join(", ");

  const total = trabajadores.reduce(
    (acc, t) => acc + (t.cantidad || 0) * (t.montoUnitario || 0),
    0
  );
  const selectedAssignedCount = selectedDetalle?.asignaciones?.length || 0;
  const selectedRemainingSlots = Math.max(
    (selectedDetalle?.cantidad || 0) - selectedAssignedCount,
    0
  );

  return (
    <AppLayout
      header={{
        title: `Solicitud #CR-${solicitud.id}`,
        tabs: ["Overview"],
        activeTab: "Overview",
      }}
    >
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* 🔥 HERO */}
        <RequestHero
          id={solicitud.id}
          titulo={solicitud.comentario}
          estado={solicitud.estado?.nombre}
          fechaActualizacion={solicitud.updatedAt}
        />

        {/* 🔥 META GRID */}
        <RequestMetaGrid
          fechaInicio={solicitud.fechaInicio}
          fechaFin={solicitud.fechaFin}
          empresa={solicitud.empresa?.nombre}
          creador={solicitud.creador?.nombre}
          turnos={turnos}
          total={total}
        />

        {/* 🔥 MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            <RequestSummaryCard
              comentario={solicitud.comentario}
            />

            <StaffList
              trabajadores={trabajadores}
              onAssign={handleOpenAssignModal}
              canAssign={canAssignWorkers}
              assignHelpText={assignBlockedMessage}
              onDownloadContract={handleDownloadContract}
              downloadingAssignmentId={downloadingAssignmentId}
            />

            {/* 🔥 HISTORIAL REAL */}
            <AuditTimeline historial={solicitud.HistorialSolicitud} />

          </div>

          {/* RIGHT */}
          <RequestActionsPanel
            estadoActual={solicitud.estado?.nombre}
            estadoActualId={solicitud.estadoId}
            onChangeEstado={handleChangeEstado}
          />

        </div>

      </div>

      <Modal isOpen={!!selectedDetalle} onClose={closeAssignModal}>
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Asignar trabajadores
            </p>

            <h3 className="text-2xl font-serif">
              {selectedDetalle?.cargo?.nombre || "Detalle"}
            </h3>

            <p className="text-sm text-gray-500">
              {formatTurnoLabel(selectedDetalle?.turno) || "Sin turno"} · {selectedAssignedCount}/
              {selectedDetalle?.cantidad || 0} asignados
            </p>
          </div>

          {modalError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {modalError}
            </div>
          )}

          {modalLoading ? (
            <p className="text-sm text-gray-500">
              Cargando trabajadores disponibles...
            </p>
          ) : selectedRemainingSlots === 0 ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Este detalle ya tiene todos sus cupos cubiertos.
            </div>
          ) : availableWorkers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay trabajadores disponibles para este cargo en ese rango de fechas.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {availableWorkers.map((worker) => (
                <label
                  key={worker.id}
                  className="flex items-start gap-3 rounded-xl border border-[#E7E4DD] p-4 hover:bg-[#F8F6F2]"
                >
                  <input
                    type="checkbox"
                    checked={selectedWorkerIds.includes(worker.id)}
                    onChange={() => handleToggleWorker(worker.id)}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {worker.nombres} {worker.apellidos}
                    </p>

                    <p className="text-xs text-gray-500">
                      {worker.cargoPrincipal?.nombre || "Sin cargo"} ·{" "}
                      {worker.comuna?.nombre || "Sin comuna"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {worker.cargoPrincipal?.area?.nombre || "Sin área"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-gray-500">
              Puedes seleccionar hasta {selectedRemainingSlots} trabajador(es).
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeAssignModal}
                className="rounded-lg border border-[#E7E4DD] px-4 py-2 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={handleAssignWorkers}
                disabled={
                  assigning ||
                  modalLoading ||
                  selectedWorkerIds.length === 0 ||
                  selectedRemainingSlots === 0
                }
                className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {assigning ? "Guardando..." : "Guardar asignación"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
