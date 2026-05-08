type Props = {
  value?: string; // ✅ AGREGAR
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea({ value, placeholder, onChange }: Props) {
  return (
    <textarea
      value={value} // ✅ AGREGAR
      placeholder={placeholder}
      onChange={onChange}
      rows={5}
      className="
        w-full
        bg-[#F6F4EF]
        border border-[#E7E4DD]
        rounded-xl
        px-4 py-3
        text-sm
        outline-none
        focus:border-[--color-gold]
        resize-none
      "
    />
  );
}