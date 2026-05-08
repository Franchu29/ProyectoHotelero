import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import RequestFormCard from "../components/RequestFormCard";
import { buildRequestFields } from "../forms/requestFields";
import type { Field } from "../forms/requestFields";
import api from "../api/axios";

type Trabajador = {
  cargoId: string;
  turnoId: string;
  cantidad: number;
  montoUnitario: number;
  tarifaId?: string;
};

type FormData = {
  fechaInicio?: string;
  fechaFin?: string;
  estadoId?: string;
  empresaId?: string;
  comentario?: string;
  trabajadores: Trabajador[];
};

  export default function CreateRequest() {
    const [formData, setFormData] = useState<FormData>({
      estadoId: "1",
      trabajadores: [],
    });

    const [fields, setFields] = useState<Field[]>([]);

  const updateTrabajador = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updated = [...prev.trabajadores];

      const newTrabajador = {
        ...updated[index],
        [field]: value,
      };

      updated[index] = newTrabajador;

      // 🔥 SI YA TENGO LOS DOS VALORES → LLAMAR API
      if (
        (field === "cargoId" || field === "turnoId") &&
        newTrabajador.cargoId &&
        newTrabajador.turnoId
      ) {
        // 👇 usamos los valores CORRECTOS (no stale)
        fetchTarifa(index, newTrabajador.cargoId, newTrabajador.turnoId);
      }

      return {
        ...prev,
        trabajadores: updated,
      };
    });
  };

  const fetchTarifa = async (index: number, cargoId: string, turnoId: string) => {
    try {
      const res = await api.get("/get-tarifa", {
        params: {
          cargoId,
          turnoId,
        },
      });

      const tarifa = res.data;

      setFormData(prev => {
        const updated = [...prev.trabajadores];

        if (tarifa) {
          updated[index] = {
            ...updated[index],
            montoUnitario: tarifa.valorHora,
            tarifaId: tarifa.id,
          };
        } else {
          updated[index] = {
            ...updated[index],
            montoUnitario: 0,
            tarifaId: "",
          };
        }

        return {
          ...prev,
          trabajadores: updated,
        };
      });

    } catch (error) {
      console.error("Error obteniendo tarifa", error);
    }
  };

  // 🔥 Catálogos para selects dinámicos del detalle
  const [catalogos, setCatalogos] = useState<any>({
    cargos: [],
    turnos: [],
    tarifas: [],
  });

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 Cargar catálogos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/catalogos-solicitud");
        const data = res.data;

        const builtFields = buildRequestFields({
          empresas: data.empresas,
        });

        setFields(builtFields);

        setCatalogos({
          cargos: data.cargos || [],
          turnos: data.turnos || [],
        });

      } catch (err) {
        console.error("Error cargando catálogos", err);
      }
    };

    fetchData();
  }, []);

  // =========================
  // 🔥 DETALLE DINÁMICO
  // =========================

  const addTrabajador = () => {
    setFormData(prev => ({
      ...prev,
      trabajadores: [
        ...prev.trabajadores,
        {
          cargoId: "",
          turnoId: "",
          cantidad: 1,
          montoUnitario: 0,
          tarifaId: "",
        },
      ],
    }));
  };

  const removeTrabajador = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trabajadores: prev.trabajadores.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // 🔥 SUBMIT COMPLETO
  // =========================

  const handleSubmit = async () => {
    try {
      if (!formData.empresaId) {
        return alert("Debe seleccionar una empresa");
      }

      if (!formData.trabajadores.length) {
        return alert("Debe agregar al menos un trabajador");
      }

      const payload = {
        fechaInicio: new Date(formData.fechaInicio!),
        fechaFin: new Date(formData.fechaFin!),

        estadoId: 1,
        empresaId: parseInt(formData.empresaId),

        comentario: formData.comentario || null,
        creadorId: 1,

        trabajadores: formData.trabajadores.map(t => ({
          cargoId: parseInt(t.cargoId),
          turnoId: parseInt(t.turnoId),
          cantidad: Number(t.cantidad),
          montoUnitario: Number(t.montoUnitario),
          tarifaId: t.tarifaId ? parseInt(t.tarifaId) : null,
        })),
      };

      await api.post("/crear_solicitud", payload);

      alert("Solicitud completa creada correctamente");

      setFormData({
        estadoId: "1",
        trabajadores: [],
      });

    } catch (err: any) {
      alert(err.response?.data?.error || "Error al crear solicitud");
    }
  };

  const fieldsWithOnChange: Field[] = fields.map(f => ({
    ...f,
    onChange: (value: any) => handleChange(f.name, value),
  }));

  return (
    <AppLayout
      header={{
        title: "Franchu's Gestor de Contratos",
        tabs: ["Overview", "New Request"],
        activeTab: "New Request",
      }}
    >
      <div className="space-y-10 max-w-[900px] mx-auto">

        {/* HEADER */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Hotel Portal · Solicitudes · Crear Nueva Solicitud
          </p>

          <h2 className="font-serif text-3xl">
            Inicializar solicitud de servicio
          </h2>

        </div>

        {/* FORM CABECERA */}
        <RequestFormCard
          fields={fieldsWithOnChange}
          formData={formData}
          showPriority={false}
          showFileUpload={false}
          onSubmit={handleSubmit}
        />

        {/* ========================= */}
        {/* 🔥 DETALLE TRABAJADORES */}
        {/* ========================= */}

        <div className="space-y-4">

          <h3 className="text-xl font-semibold">
            Detalle de trabajadores
          </h3>

          <button
            onClick={addTrabajador}
            className="px-4 py-2 bg-black text-white rounded"
          >
            + Agregar trabajador
          </button>

          {formData.trabajadores.map((t, index) => (
            <div key={index} className="grid grid-cols-5 gap-3 border p-4 rounded">

              {/* Cargo */}
              <select
                value={t.cargoId}
                onChange={e => updateTrabajador(index, "cargoId", e.target.value)}
              >
                <option value="">Seleccione Cargo</option>
                {catalogos.cargos.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              {/* Turno */}
              <select
                value={t.turnoId}
                onChange={e => updateTrabajador(index, "turnoId", e.target.value)}
              >
                <option value="">Seleccione Turno</option>
                  {catalogos.turnos.map((turno: any) => (
                    <option key={turno.id} value={turno.id}>
                      {turno.label}
                    </option>
                  ))}
              </select>

              {/* Cantidad */}
              <input
                type="number"
                placeholder="Cantidad"
                value={t.cantidad}
                onChange={e => updateTrabajador(index, "cantidad", e.target.value)}
              />

              {/* Monto */}
              <input
                type="number"
                placeholder="Monto"
                value={t.montoUnitario ?? 0}
                readOnly
              />

              {/* Eliminar */}
              <button
                onClick={() => removeTrabajador(index)}
                className="text-red-500"
              >
                Eliminar
              </button>

            </div>
          ))}

        </div>

      </div>
    </AppLayout>
  );
}
