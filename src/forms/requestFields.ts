export type Option = {
  label: string;
  value: string | number;
};

export type Field = {
  type: "input" | "date" | "select" | "textarea";
  label: string;
  name: string;
  placeholder?: string;
  options?: Option[];
  onChange?: (value: any) => void;
};

// 🔥 Factory function
export const buildRequestFields = (data?: {
  empresas?: any[];
}): Field[] => {
  return [
    {
      type: "date",
      label: "Fecha de inicio",
      name: "fechaInicio",
    },
    {
      type: "date",
      label: "Fecha de término",
      name: "fechaFin",
    },
    {
      type: "select",
      label: "Empresa",
      name: "empresaId",
      options: [
        { label: "Seleccione una empresa", value: "" },
        ...(data?.empresas?.map(e => ({
          label: e.nombre,
          value: e.id,
        })) || []),
      ],
    },
    {
      type: "textarea",
      label: "Comentario",
      name: "comentario",
      placeholder: "Opcional",
    },
  ];
};
