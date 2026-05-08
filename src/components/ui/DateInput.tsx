type Props = {
  value?: string;
  onChange?: (value: string) => void; // devuelve el valor seleccionado
};

export default function DateInput({ value, onChange }: Props) {
  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange?.(e.target.value)}
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
    />
  );
}