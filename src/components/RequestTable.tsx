type Solicitud = {
  id: number;
  comentario?: string;
  estado?: {
    nombre: string;
  };
};

type Props = {
  solicitudes: Solicitud[];
};

export default function RequestTable({ solicitudes }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E4DD] p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl">Request Ledger</h2>

        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1 rounded bg-gray-100">ALL</button>
          <button className="px-3 py-1 rounded">ACTIVE</button>
          <button className="px-3 py-1 rounded">PENDING</button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="text-gray-400 text-xs tracking-wider">
          <tr>
            <th className="text-left py-3">ID</th>
            <th className="text-left">Comentario</th>
            <th className="text-left">Estado</th>
          </tr>
        </thead>

        <tbody>
          {solicitudes.map((sol) => (
            <tr key={sol.id} className="border-t">
              <td className="py-4">#{sol.id}</td>

              <td>{sol.comentario || "Sin comentario"}</td>

              <td>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs
                    ${sol.estado?.nombre === "pendiente" && "bg-yellow-100 text-yellow-700"}
                    ${sol.estado?.nombre === "aprobado" && "bg-green-100 text-green-700"}
                    ${sol.estado?.nombre === "rechazado" && "bg-red-100 text-red-700"}
                  `}
                >
                  {sol.estado?.nombre || "N/A"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}