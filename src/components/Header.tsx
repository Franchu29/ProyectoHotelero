import { Bell, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type HeaderProps = {
  title: string;
  tabs?: string[];
  activeTab?: string;
};

export default function Header({ title, tabs, activeTab }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  // cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-12">
      {/* LEFT */}
      <div className="flex items-center gap-10">
        <h1 className="font-serif text-xl">{title}</h1>

        {tabs && (
          <div className="flex gap-6 text-[13px]">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`relative pb-2 cursor-pointer ${
                  tab === activeTab
                    ? "text-dark"
                    : "text-gray-400 hover:text-dark"
                }`}
              >
                {tab}
                {tab === activeTab && (
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[--color-gold]" />
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* ICONS */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-[#EDEAE3] transition">
            <Bell className="w-5 h-5 text-gray-400 hover:text-dark" />
          </button>

          <button className="p-2 rounded-lg hover:bg-[#EDEAE3] transition">
            <Settings className="w-5 h-5 text-gray-400 hover:text-dark" />
          </button>
        </div>

        {/* AVATAR + DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="bg-gradient-to-br from-teal-600 to-teal-800 text-white w-9 h-9 rounded-full text-sm flex items-center justify-center shadow-sm hover:scale-[1.05] transition"
          >
            {user?.nombre?.charAt(0).toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-[--color-light] rounded-2xl shadow-xl border border-[#ECE7DC] py-2 z-50 overflow-hidden">
              
              {/* USER INFO */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-[--color-dark]">
                  {user?.nombre || "Usuario"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || "correo@ejemplo.com"}
                </p>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-[#ECE7DC] my-1"></div>

              {/* ACTIONS */}
              <button
                onClick={async () => {
                  try {
                    await logout();
                    window.location.href = "/login";
                  } catch (error) {
                    console.error("Error al cerrar sesión", error);
                  }
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[--color-dark] hover:bg-[#F4F1EA] transition group"
              >
                <span className="w-2 h-2 rounded-full bg-[--color-gold] opacity-70 group-hover:opacity-100"></span>
                Salir de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}