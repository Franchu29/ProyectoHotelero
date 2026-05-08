import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};

export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="bg-white border border-[#E7E4DD] rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-medium text-dark">{item.title}</span>

              <ChevronDown
                size={18}
                className={clsx(
                  "transition-transform duration-200 text-[var(--color-gold)]",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <div
              className={clsx(
                "overflow-hidden transition-all duration-300 px-4",
                isOpen ? "max-h-96 pb-4" : "max-h-0"
              )}
            >
              <div className="text-sm text-gray-500">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}