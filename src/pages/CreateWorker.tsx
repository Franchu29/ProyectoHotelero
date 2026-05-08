import AppLayout from "../components/layout/AppLayout";
import RequestFormCard from "../components/RequestFormCard";
import type { Field } from "../forms/trabajadorFields";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CrearTrabajador() {

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

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 Cargar catálogos dinámicos
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const res = await api.get("/catalogos");
        const data = res.data;

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
              value: c.id
            }))
          },

          {
            type: "select",
            label: "Estado Civil",
            name: "estadoCivilId",
            options: data.estadosCiviles.map((e: any) => ({
              label: e.nombre,
              value: e.id
            }))
          },

          {
            type: "select",
            label: "Previsión",
            name: "previsionId",
            options: data.previsiones.map((p: any) => ({
              label: p.nombre,
              value: p.id
            }))
          },

          {
            type: "select",
            label: "Afiliación",
            name: "afiliacionId",
            options: data.afiliaciones.map((a: any) => ({
              label: a.nombre,
              value: a.id
            }))
          },

          {
            type: "select",
            label: "Cargo Principal",
            name: "cargoPrincipalId",
            options: data.cargos.map((c: any) => ({
              label: `${c.nombre} (${c.area?.nombre || "Sin área"})`,
              value: c.id
            }))
          }
        ];

        setFields(dynamicFields);

      } catch (err) {
        console.error("Error cargando catálogos", err);
      }
    };

    fetchCatalogos();
  }, []);

  const handleSubmit = async () => {
    try {
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

      await api.post("/crear_trabajador", payload);

      alert("Trabajador creado correctamente");

      setFormData({
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

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error al crear trabajador");
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
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">
          Formulario de Nuevo Trabajador
        </h1>

        <RequestFormCard
          fields={fieldsWithOnChange}
          formData={formData}
          showPriority={false}
          showFileUpload={false}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}