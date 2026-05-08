import StatsCard from "./StatsCard";

type Props = {
  fechaInicio?: string;
  fechaFin?: string;
  empresa?: string;
  creador?: string;
  turnos?: string;
  total?: number;
};

export default function RequestMetaGrid({
  fechaInicio,
  fechaFin,
  empresa,
  creador,
  turnos,
  total,
}: Props) {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "$0";
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

      <StatsCard
        label="Inicio"
        value={formatDate(fechaInicio)}
      />

      <StatsCard
        label="Fin"
        value={formatDate(fechaFin)}
      />

      <StatsCard
        label="Empresa"
        value={empresa || "-"}
      />

      <StatsCard
        label="Creador"
        value={creador || "-"}
      />

      <StatsCard
        label="Turno"
        value={turnos || "-"}
      />

      <StatsCard
        label="Total"
        value={formatCurrency(total)}
        variant="large"
      />

    </div>
  );
}
