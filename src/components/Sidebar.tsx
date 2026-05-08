import {
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
  Archive,
} from "lucide-react";

import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";

export default function Sidebar() {
  const baseClasses =
    "flex items-center gap-3 p-3 rounded-xl transition text-sm";

  return (
    <div className="w-72 bg-[#F6F4EF] border-r border-[#E7E4DD] p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-gold to-premium w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm">
            🧾
          </div>

          <div>
            <p className="font-serif text-sm tracking-tight">
              Hotel Portal
            </p>
            <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">
              Gestor de Contratos
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <Link to="/create-request">
          <button className="w-full bg-gradient-to-r from-gold to-premium text-white py-2.5 rounded-xl mb-10 shadow hover:scale-[1.02] hover:shadow-md transition-all duration-200">
            + Nueva Solicitud
          </button>
        </Link>

        {/* NAV */}
        <nav className="space-y-2">

          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              clsx(
                baseClasses,
                isActive
                  ? "bg-[#EDEAE3] text-dark border-l-2 border-gold"
                  : "text-gray-400 hover:text-dark hover:bg-[#F1EEE8]"
              )
            }
          >
            <LayoutDashboard size={16} className="text-[var(--color-gold)]" />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          {/* SOLICITUDES */}
          <NavLink
            to="/request-detail"
            className={({ isActive }) =>
              clsx(
                baseClasses,
                isActive
                  ? "bg-[#EDEAE3] text-dark border-l-2 border-gold"
                  : "text-gray-400 hover:text-dark hover:bg-[#F1EEE8]"
              )
            }
          >
            <FileText size={16} className="text-[var(--color-gold)]" />
            <span>Solicitudes</span>
          </NavLink>

          {/* TRABAJADORES */}
          <NavLink
            to="/workersdirectory"
            className={({ isActive }) =>
              clsx(
                baseClasses,
                isActive
                  ? "bg-[#EDEAE3] text-dark border-l-2 border-gold"
                  : "text-gray-400 hover:text-dark hover:bg-[#F1EEE8]"
              )
            }
          >
            <Users size={16} className="text-[var(--color-gold)]" />
            <span>Trabajadores</span>
          </NavLink>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-2 text-sm">

        <div className="flex items-center gap-3 text-gray-400 hover:text-dark hover:bg-[#F1EEE8] p-3 rounded-xl cursor-pointer transition">
          <Archive size={16} className="text-[var(--color-gold)]" />
          <span>Archivos</span>
        </div>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            clsx(
              baseClasses,
              isActive
                ? "bg-[#EDEAE3] text-dark border-l-2 border-gold"
                : "text-gray-400 hover:text-dark hover:bg-[#F1EEE8]"
            )
          }
        >
          <HelpCircle size={16} className="text-[var(--color-gold)]" />
          <span>Ayuda</span>
        </NavLink>
      </div>
    </div>
  );
}