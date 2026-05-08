import AppLayout from "../components/layout/AppLayout";
import StaffCard from "../components/StaffCard";
import StatsCard from "../components/StatsCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"; // 🔥 IMPORTANTE

type Trabajador = {
  id: number;
  nombres: string;
  apellidos: string;
  comuna?: {
    nombre: string;
  };
  cargoPrincipal?: {
    nombre: string;
    area?: {
      nombre: string;
    };
  };
};

export default function WorkersDirectory() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // 🔵 CARGAR TRABAJADORES
  // =========================
  useEffect(() => {
    const getWorkers = async () => {
      try {
        const res = await api.get("/trabajadores");
        setWorkers(res.data);
      } catch (err: any) {
        console.error("Error cargando trabajadores:", err);
        setError("No se pudieron cargar los trabajadores");
      } finally {
        setLoading(false);
      }
    };

    getWorkers();
  }, []);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <AppLayout
        header={{
        title: "Franchu's Gestor de Contratos",
          tabs: ["Overview"],
          activeTab: "Overview",
        }}
      >
        <div className="p-10 text-center text-gray-500">
          Cargando trabajadores...
        </div>
      </AppLayout>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (error) {
    return (
      <AppLayout
        header={{
          title: "Grand Reserve Contracts",
          tabs: ["Overview"],
          activeTab: "Overview",
        }}
      >
        <div className="p-10 text-center text-red-500">
          {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={{
        title: "Grand Reserve Contracts",
        tabs: ["Overview", "New Request"],
        activeTab: "Overview",
      }}
    >
      <div className="max-w-[1500px] mx-auto">

        {/* HERO */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-serif mb-3">
              Worker Directory
            </h1>

            <p className="text-gray-500 max-w-xl">
              Manage your elite tier of hospitality staff and specialized service contractors.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border rounded-xl text-sm">
              Grid
            </button>

            <button className="px-4 py-2 text-gray-400 text-sm">
              List
            </button>

            <button className="px-4 py-2 bg-white border rounded-xl text-sm">
              Filters
            </button>

            <button
              onClick={() => navigate("/workers/new")}
              className="px-5 py-2 bg-[--color-gold] text-white rounded-xl text-sm font-medium"
            >
              + Add Worker
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-8 mb-16">

          {/* ADD NEW */}
          <div
            onClick={() => navigate("/workers/new")}
            className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center text-gray-400 hover:bg-[#F7F5F2] transition cursor-pointer"
          >
            <div className="text-3xl mb-3">+</div>
            <p className="font-medium text-dark">Add New Personnel</p>
            <p className="text-xs">Register staff or contractor</p>
          </div>

          {workers.length > 0 ? (
            workers.map((worker) => (
              <StaffCard
                key={worker.id}
                name={`${worker.nombres} ${worker.apellidos}`}
                role={worker.cargoPrincipal?.nombre || "Sin cargo"}
                tags={[
                  worker.cargoPrincipal?.area?.nombre || "General",
                ]}
                status="active"
                badge="EMPLOYEE"
                assignment={
                  worker.comuna?.nombre || "Sin asignación"
                }
                onEdit={() => navigate(`/workers/${worker.id}/edit`)}
              />
            ))
          ) : (
            <div className="col-span-2 text-gray-400">
              No hay trabajadores registrados
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-3 gap-8">

          {/* INSIGHTS */}
          <div className="col-span-2 bg-[#F8F6F2] rounded-2xl p-8 border border-[#E7E4DD]">
            <h2 className="font-serif text-2xl mb-6">
              Operational Insights
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <StatsCard
                label="Staff Distribution"
                value="84%"
                subtitle="+5% from last week"
              />

              <StatsCard
                label="Contractor Efficiency"
                value="4.9"
                subtitle="out of 5.0 rating"
              />
            </div>
          </div>

          {/* SKILLS */}
          <div className="bg-[#F8F6F2] rounded-2xl p-6 border border-[#E7E4DD]">
            <h3 className="font-serif text-lg mb-4">
              Quick Search by Skill
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                "Culinary Arts",
                "Logistics",
                "Guest Services",
                "Technical Ops",
                "Security",
                "Sommelier",
              ].map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 bg-white border rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
