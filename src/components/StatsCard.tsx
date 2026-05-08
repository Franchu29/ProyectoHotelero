type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  alert?: boolean;
  variant?: "default" | "large";
};

export default function StatsCard({
  label,
  value,
  subtitle,
  alert,
  variant = "default",
}: Props) {
  return (
    <div
      className={`
        rounded-2xl border border-[#E7E4DD] p-6
        ${variant === "large" ? "bg-[#EFECE6]" : "bg-[#F8F6F2]"}
      `}
    >
      {/* LABEL */}
      <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-4">
        {label}
      </p>

      {/* VALUE */}
      <h3
        className={`
          font-serif tracking-[-0.02em] leading-none
          ${variant === "large" ? "text-5xl" : "text-2xl"}
        `}
      >
        {value}
      </h3>

      {/* SUBTITLE */}
      {subtitle && (
        <p className="text-[13px] text-gray-500 mt-3">
          {subtitle}
        </p>
      )}

      {/* ALERT */}
      {alert && (
        <span className="mt-4 inline-block text-[10px] tracking-[0.2em] bg-red-100 text-red-600 px-3 py-1 rounded-full">
          HIGH PRIORITY
        </span>
      )}
    </div>
  );
}