type Props = {
  name: string;
  role: string;
  tags: string[];
  status: "active" | "standby" | "offline";
  badge?: string;
  assignment: string;
  onEdit?: () => void;
};

export default function StaffCard({
  name,
  role,
  tags,
  status,
  badge,
  assignment,
  onEdit,
}: Props) {
  const statusLabel =
    status === "active"
      ? "Activo"
      : status === "standby"
      ? "En espera"
      : "Offline";

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E7E4DD] space-y-4">

      {/* TOP */}
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />

        {badge && (
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#E8C98F] text-[#5A3E1B]">
            {badge}
          </span>
        )}
      </div>

      {/* NAME */}
      <div>
        <h3 className="font-serif text-lg">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-[#EDEAE3] px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ASSIGNMENT */}
      <div className="text-xs text-gray-400">
        <p className="uppercase tracking-wide">Asgnación</p>
        <p className="text-dark text-sm mt-1">{assignment}</p>
        <p className="mt-2 text-xs text-gray-500">Estado: {statusLabel}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="rounded-lg border border-[#E7E4DD] px-4 py-2 text-sm text-gray-700 transition hover:bg-[#F8F6F2]"
        >
          Editar
        </button>
      </div>

    </div>
  );
}
