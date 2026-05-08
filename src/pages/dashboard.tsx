import { useEffect, useState } from "react";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";
import StatsCard from "../components/StatsCard";
import RequestCard from "../components/RequestCard";
import RecentAssignedWorkers from "../components/RecentAssignedWorkers";

type Solicitud = {
  id: number;
  comentario?: string;
  monto?: number;
  fecha?: string;
  estadoId?: number;
  estado?: {
    nombre: string;
  };
};

type DashboardResumen = {
  solicitudesPorEstado: {
    1: number;
    2: number;
  };
  trabajadoresRecientes: {
    id: number;
    nombres: string;
    apellidos: string;
    comuna?: string | null;
    cargo?: string | null;
    area?: string | null;
    solicitudId?: number | null;
    empresa?: string | null;
  }[];
};

export default function Dashboard() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState<DashboardResumen>({
    solicitudesPorEstado: {
      1: 0,
      2: 0,
    },
    trabajadoresRecientes: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [solicitudesRes, resumenRes] = await Promise.all([
          api.get("/getSolicitudes"),
          api.get("/dashboard/resumen"),
        ]);

        setSolicitudes(solicitudesRes.data);
        setResumen(resumenRes.data);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const solicitudesActivas = solicitudes.filter(
    (solicitud) => solicitud.estadoId === 1 || solicitud.estadoId === 2
  );

  return (
    <AppLayout
      header={{
        title: "Franchu's Gestor de Contratos",
        tabs: ["Overview", "New Request"],
        activeTab: "Overview",
      }}
    >
      <div className="max-w-[1500px] mx-auto">

        {/* TITLE */}
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-4">
            Rendimiento
          </p>

          <h1 className="text-7xl font-serif leading-[1.05] tracking-[-0.02em]">
            Resumen
          </h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="col-span-2">
            <StatsCard
              variant="large"
              label="Solicitudes abiertas"
              value={resumen.solicitudesPorEstado[1] + resumen.solicitudesPorEstado[2]}
              subtitle={`Pendientes: ${resumen.solicitudesPorEstado[1]} · En revision: ${resumen.solicitudesPorEstado[2]}`}
            />
          </div>

          <div className="space-y-6">
            <StatsCard
              label="Solicitudes pendientes"
              value={resumen.solicitudesPorEstado[1]}
            />
            <StatsCard
              label="Solicitudes en revision"
              value={resumen.solicitudesPorEstado[2]}
              alert={resumen.solicitudesPorEstado[2] > 0}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-12">

          {/* LEFT */}
          <div className="col-span-2">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif tracking-[-0.01em]">
                SOLICITUDES ACTIVAS
              </h2>

              <span className="text-[10px] text-gray-400 tracking-[0.2em] hover:text-dark cursor-pointer transition">
                VER TODAS LAS SOLICITUDES
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-400">Cargando solicitudes...</p>
              ) : solicitudesActivas.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay solicitudes pendientes o en revision
                </p>
              ) : (
                solicitudesActivas.slice(0, 5).map((s) => (
                  <RequestCard
                    key={s.id}
                    title={`Solicitud #${s.id}`}
                    subtitle={s.comentario || "Sin comentario"}
                    status={s.estado?.nombre?.toLowerCase() || "pendiente"}
                    monto={s.monto}
                    fecha={s.fecha}
                  />
                ))
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6 sticky top-10">

            <RecentAssignedWorkers
              workers={resumen.trabajadoresRecientes}
              loading={loading}
            />

            <div className="bg-[#1F1F1F] text-white p-7 rounded-2xl shadow-xl">
              <p className="text-gold mb-3 text-lg">◆</p>

              <h3 className="font-serif text-xl mb-2">
                Platinum Readiness
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed">
                34 standby workers have just completed Luxury Etiquette 
                certification for Q4 events.
              </p>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
