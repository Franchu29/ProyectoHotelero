type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({  value, placeholder, onChange }: Props) {
  return (
    <input
      type="text"
      value={value} 
      placeholder={placeholder}
      onChange={onChange} // aquí pasamos la función
      className="w-full border border-[#E7E4DD] rounded-xl px-4 py-2"
    />
  );
}