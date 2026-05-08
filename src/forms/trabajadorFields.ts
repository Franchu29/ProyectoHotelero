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