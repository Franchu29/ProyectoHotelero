import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import DateInput from "../components/ui/DateInput";
import TextArea from "../components/ui/TextArea";
import FileUpload from "../components/ui/FileUpload";
import PrioritySelector from "../components/ui/PrioritySelector";
import type { Field as BaseField } from "../forms/trabajadorFields";

type Field = BaseField & {
  onChange?: (value: any) => void;
};

interface RequestFormCardProps {
  fields?: Field[];
  showPriority?: boolean;
  showFileUpload?: boolean;
  onSubmit?: () => void;
  formData?: Record<string, any>; // ✅ CORRECTO
}

export default function RequestFormCard({
  fields = [],
  showPriority = true,
  showFileUpload = true,
  onSubmit,
  formData = {}, // ✅ default correcto
}: RequestFormCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E4DD] p-8 space-y-8">
      <div className="grid grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <FormField key={index} label={field.label}>

            {/* INPUT */}
            {field.type === "input" && (
              <Input
                value={formData[field.name] || ""} // ✅ CONTROLADO
                placeholder={field.placeholder ?? ""}
                onChange={e => field.onChange?.(e.target.value)}
              />
            )}

            {/* DATE */}
            {field.type === "date" && (
              <DateInput
                value={formData[field.name] || ""} // ✅ CONTROLADO
                onChange={value => field.onChange?.(value)}
              />
            )}

            {/* SELECT */}
            {field.type === "select" && (
              <Select
                value={formData[field.name] || ""} // ✅ CONTROLADO
                placeholder={field.placeholder ?? ""}
                options={field.options}
                onChange={(value) => field.onChange?.(value)}
              />
            )}

            {/* TEXTAREA */}
            {field.type === "textarea" && (
              <TextArea
                value={formData[field.name] || ""} // ✅ CONTROLADO
                placeholder={field.placeholder ?? ""}
                onChange={e => field.onChange?.(e.target.value)}
              />
            )}

          </FormField>
        ))}
      </div>

      {showPriority && <PrioritySelector />}
      {showFileUpload && <FileUpload />}

      <div className="flex justify-between items-center pt-4 border-t border-[#E7E4DD]">
        <button className="text-sm text-gray-500 hover:text-black">
          Cancel request
        </button>

        <button
          className="bg-[--color-gold] text-white px-6 py-3 rounded-xl font-medium"
          onClick={onSubmit}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}