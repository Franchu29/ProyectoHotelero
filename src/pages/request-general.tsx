import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";
import StatsCard from "../components/StatsCard";

type Solicitud = {
  id: number;
  comentario?: string;
  monto?: number;
  fecha?: string;
  estado?: {
    nombre: string;
  };
};

type FilterType = "ALL" | "ACTIVE" | "PENDING" | "REJECTED";

export default function RequestDetail() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await api.get("/getSolicitudes");

        if (Array.isArray(res.data)) {
          setSolicitudes(res.data);
        } else if (Array.isArray(res.data.solicitudes)) {
          setSolicitudes(res.data.solicitudes);
        } else {
          setSolicitudes([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSolicitudes();
  }, []);

  // 🔹 helpers
  const formatCurrency = (value?: number) => {
    if (!value) return "$0";
    return `$${value.toLocaleString("es-CL")}`;
  };

  const getBadge = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "aprobado":
      case "aprobada":
        return "bg-green-100 text-green-700";
      case "rechazado":
      case "rechazada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getEstado = (s: Solicitud) =>
    s.estado?.nombre?.toLowerCase() || "";

  // 🔥 FILTRO + SEARCH
  const filteredSolicitudes = solicitudes
    .filter((s) => {
      const estado = getEstado(s);

      if (filter === "ALL") return true;
      if (filter === "ACTIVE") return estado === "aprobada";
      if (filter === "PENDING") return estado === "pendiente";
      if (filter === "REJECTED") return estado === "rechazada";

      return true;
    })
    .filter((s) => {
      if (!search) return true;

      return (
        s.comentario?.toLowerCase().includes(search.toLowerCase()) ||
        String(s.id).includes(search)
      );
    });

  // 🔥 DELETE REAL
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Eliminar solicitud?");
    if (!confirm) return;

    try {
      await api.delete(`/solicitudes/${id}`);

      // actualización optimista
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error eliminando", error);
    }
  };

  return (
    <AppLayout
      header={{
        title: "Franchu's Gestor de Contratos",
        tabs: ["Overview", "New Request"],
        activeTab: "Overview",
      }}
    >
      <div className="space-y-8">

        {/* 🔹 TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label="VALOR TOTAL"
            value={formatCurrency(
              solicitudes.reduce((acc, s) => acc + (s.monto || 0), 0)
            )}
            variant="large"
          />

          <StatsCard
            label="PENDIENTES DE APROBACIÓN"
            value={
              solicitudes.filter(
                (s) => s.estado?.nombre?.toLowerCase() === "pendiente"
              ).length
            }
          />

          <StatsCard
            label="COMPLETADAS"
            value={
              solicitudes.filter(
                (s) => s.estado?.nombre?.toLowerCase() === "aprobada"
              ).length
            }
          />
        </div>

        {/* 🔹 TABLE */}
        <div className="bg-white rounded-2xl border border-[#E7E4DD] p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl">TABLA DE SOLICITUDES</h2>

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          {/* FILTROS */}
          <div className="flex gap-2 text-xs mb-6">
            {["ALL", "ACTIVE", "PENDING", "REJECTED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as FilterType)}
                className={`px-3 py-1 rounded transition ${
                  filter === f
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs tracking-wider">
              <tr>
                <th className="text-left py-3">ID</th>
                <th className="text-left">COMENTARIO</th>
                <th className="text-left">Estado</th>
                <th className="text-left">Fecha</th>
                <th className="text-left">Valor</th>
                <th className="text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredSolicitudes.map((sol) => {

                return (
                  <tr
                    key={sol.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-4 font-medium">
                      #CR-{sol.id}
                    </td>

                    <td>
                      {sol.comentario || "Sin comentario"}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getBadge(
                          sol.estado?.nombre
                        )}`}
                      >
                        {sol.estado?.nombre || "N/A"}
                      </span>
                    </td>

                    <td>
                      {sol.fecha
                        ? new Date(sol.fecha).toLocaleDateString("es-CL")
                        : "-"}
                    </td>

                    <td className="font-medium">
                      {formatCurrency(sol.monto)}
                    </td>

                    {/* 🔥 ACTIONS */}
                    <td className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === sol.id ? null : sol.id
                          )
                        }
                        className="text-gray-500 hover:text-black"
                      >
                        ⋮
                      </button>

                      {openMenuId === sol.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => navigate(`/requests/${sol.id}`)}
                          >
                            Ver
                          </button>

                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 text-sm"
                            onClick={() => handleDelete(sol.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="text-xs text-gray-400 mt-4">
            Showing {filteredSolicitudes.length} entries
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
