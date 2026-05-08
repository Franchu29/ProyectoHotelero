type RequestCardProps = {
  title: string;
  subtitle: string;
  status: string;
  monto?: number;
  fecha?: string;
};

export default function RequestCard({
  title,
  subtitle,
  status,
  monto,
  fecha,
}: RequestCardProps) {

  const getStatusStyles = () => {
    switch (status) {
      case "aprobado":
        return "bg-green-100 text-green-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "rechazado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const formatCLP = (value?: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value || 0);

  return (
    <div className="
      p-6 
      rounded-2xl 
      border border-[#E7E4DD] 
      bg-[#FDFCF9] 
      hover:shadow-lg 
      transition
      cursor-pointer
    ">

      {/* TOP */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-serif text-lg tracking-[-0.01em]">
          {title}
        </h3>

        <span
          className={`px-2 py-1 text-[10px] rounded-full font-medium ${getStatusStyles()}`}
        >
          {status}
        </span>
      </div>

      {/* SUBTITLE */}
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        {subtitle}
      </p>

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-gray-400">

        <span>
          {fecha
            ? new Date(fecha).toLocaleDateString("es-CL")
            : "-"}
        </span>

        <span className="font-medium text-gray-700">
          {formatCLP(monto)}
        </span>

      </div>
    </div>
  );
}