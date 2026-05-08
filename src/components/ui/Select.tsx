type Option = {
  label: string;
  value: string | number;
};

type Props = {
  value?: string | number;
  placeholder?: string;
  options?: Option[];
  onChange?: (value: string | number) => void;
};

export default function Select({
  value,
  placeholder,
  options = [],
  onChange,
}: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => {
        const rawValue = e.target.value; // ✅ ahora sí

        // 🔥 convertir automáticamente a number si corresponde
        const parsedValue =
          rawValue === ""
            ? "" // importante para placeholder
            : isNaN(Number(rawValue))
            ? rawValue
            : Number(rawValue);

        onChange?.(parsedValue);
      }}
      className="
        w-full
        bg-[#F6F4EF]
        border border-[#E7E4DD]
        rounded-xl
        px-4 py-3
        text-sm
        text-gray-500
        outline-none
        focus:border-[--color-gold]
      "
    >
      {placeholder && <option value="">{placeholder}</option>}

      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}