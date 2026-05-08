import AppLayout from "../components/layout/AppLayout";
import RequestFormCard from "../components/RequestFormCard";
import type { Field } from "../forms/trabajadorFields";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

type TrabajadorFormData = {
  nombres: string;
  apellidos: string;
  rut: string;
  direccion: string;
  fechaNacimiento: string;
  comunaId: string;
  estadoCivilId: string;
  previsionId: string;
  afiliacionId: string;
  cargoPrincipalId: string;
};

export default function EditWorker() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TrabajadorFormData>({
    nombres: "",
    apellidos: "",
    rut: "",
    direccion: "",
    fechaNacimiento: "",
    comunaId: "",
    estadoCivilId: "",
    previsionId: "",
    afiliacionId: "",
    cargoPrincipalId: "",
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [catalogosRes, trabajadorRes] = await Promise.all([
          api.get("/catalogos"),
          api.get(`/trabajadores/${id}`),
        ]);

        const data = catalogosRes.data;
        const trabajador = trabajadorRes.data;

        const dynamicFields: Field[] = [
          { type: "input", label: "Nombres", name: "nombres", placeholder: "Ingrese los nombres" },
          { type: "input", label: "Apellidos", name: "apellidos", placeholder: "Ingrese los apellidos" },
          { type: "input", label: "RUT", name: "rut", placeholder: "Ingrese el RUT" },
          { type: "input", label: "Dirección", name: "direccion", placeholder: "Ingrese la dirección" },
          { type: "date", label: "Fecha de nacimiento", name: "fechaNacimiento" },
          {
            type: "select",
            label: "Comuna",
            name: "comunaId",
            options: data.comunas.map((c: any) => ({
              label: c.nombre,
              value: c.id,
            })),
          },
          {
            type: "select",
            label: "Estado Civil",
            name: "estadoCivilId",
            options: data.estadosCiviles.map((e: any) => ({
              label: e.nombre,
              value: e.id,
            })),
          },
          {
            type: "select",
            label: "Previsión",
            name: "previsionId",
            options: data.previsiones.map((p: any) => ({
              label: p.nombre,
              value: p.id,
            })),
          },
          {
            type: "select",
            label: "Afiliación",
            name: "afiliacionId",
            options: data.afiliaciones.map((a: any) => ({
              label: a.nombre,
              value: a.id,
            })),
          },
          {
            type: "select",
            label: "Cargo Principal",
            name: "cargoPrincipalId",
            options: data.cargos.map((c: any) => ({
              label: `${c.nombre} (${c.area?.nombre || "Sin área"})`,
              value: c.id,
            })),
          },
        ];

        setFields(dynamicFields);
        setFormData({
          nombres: trabajador.nombres || "",
          apellidos: trabajador.apellidos || "",
          rut: trabajador.rut || "",
          direccion: trabajador.direccion || "",
          fechaNacimiento: trabajador.fechaNacimiento
            ? new Date(trabajador.fechaNacimiento).toISOString().split("T")[0]
            : "",
          comunaId: trabajador.comunaId ? String(trabajador.comunaId) : "",
          estadoCivilId: trabajador.estadoCivilId
            ? String(trabajador.estadoCivilId)
            : "",
          previsionId: trabajador.previsionId ? String(trabajador.previsionId) : "",
          afiliacionId: trabajador.afiliacionId
            ? String(trabajador.afiliacionId)
            : "",
          cargoPrincipalId: trabajador.cargoPrincipalId
            ? String(trabajador.cargoPrincipalId)
            : "",
        });
      } catch (error) {
        console.error("Error cargando trabajador para edición", error);
        alert("No se pudo cargar el trabajador");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const payload = {
        ...formData,
        comunaId: parseInt(formData.comunaId),
        estadoCivilId: parseInt(formData.estadoCivilId),
        previsionId: parseInt(formData.previsionId),
        afiliacionId: parseInt(formData.afiliacionId),
        cargoPrincipalId: formData.cargoPrincipalId
          ? parseInt(formData.cargoPrincipalId)
          : null,
      };

      await api.put(`/trabajadores/${id}`, payload);

      alert("Trabajador actualizado correctamente");
      navigate("/workersdirectory");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error al actualizar trabajador");
    } finally {
      setSaving(false);
    }
  };

  const fieldsWithOnChange: Field[] = fields.map((field) => ({
    ...field,
    onChange: (value: any) => handleChange(field.name, value),
  }));

  return (
    <AppLayout
      header={{
        title: "Franchu's Gestor de Contratos",
        tabs: ["Overview", "New Request"],
        activeTab: "Overview",
      }}
    >
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">
          Editar trabajador
        </h1>

        {loading ? (
          <div className="rounded-2xl border border-[#E7E4DD] bg-white p-8 text-center text-gray-500">
            Cargando datos del trabajador...
          </div>
        ) : (
          <>
            <RequestFormCard
              fields={fieldsWithOnChange}
              formData={formData}
              showPriority={false}
              showFileUpload={false}
              onSubmit={handleSubmit}
            />

            {saving && (
              <p className="mt-4 text-sm text-gray-500">
                Guardando cambios...
              </p>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
