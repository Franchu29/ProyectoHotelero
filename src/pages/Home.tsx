import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    value: "24/7",
    label: "Seguimiento continuo",
    description: "Mantiene visibilidad del estado de cada contrato y solicitud.",
  },
  {
    value: "+Orden",
    label: "Procesos centralizados",
    description: "Concentra altas, revisiones y control operativo en un solo lugar.",
  },
  {
    value: "1 panel",
    label: "Decisiones más rápidas",
    description: "Facilita ver equipo, solicitudes activas y prioridades del día.",
  },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f0e6] text-[#1f2937]">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.25),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(20,83,45,0.18),_transparent_28%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6b31]">
                Gestor de Contratos
              </p>
              <h1 className="mt-3 font-serif text-2xl text-[#1f2937]">
                Franchu&apos;s Operations
              </h1>
            </div>

            <Link
              to="/login"
              className="rounded-full border border-[#d7c2a0] bg-white/80 px-5 py-2 text-sm font-medium text-[#1f2937] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              Iniciar sesión
            </Link>
          </header>

          <section className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#8b6b31]">
                Plataforma interna
              </p>

              <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#1f2937] md:text-7xl">
                Administra contratos y solicitudes desde una sola vista.
              </h2>

              <p className="mt-8 max-w-xl text-lg leading-8 text-[#4b5563]">
                Una portada simple para orientar a quien entra por primera vez
                y un acceso directo al sistema para el equipo operativo.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-[#1f2937] px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#111827]"
                >
                  Entrar al sistema
                </Link>

                <a
                  href="#overview"
                  className="inline-flex items-center justify-center rounded-full border border-[#d7c2a0] px-7 py-3 text-sm font-medium text-[#1f2937] transition hover:-translate-y-0.5 hover:bg-white/70"
                >
                  Ver resumen
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-[#c5a059]/20 blur-2xl" />
              <div className="absolute -right-6 bottom-10 h-36 w-36 rounded-full bg-[#14532d]/15 blur-3xl" />

              <div className="relative rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(31,41,55,0.12)] backdrop-blur">
                <div className="rounded-[24px] bg-[#1f2937] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f2d59a]">
                    Estado general
                  </p>
                  <p className="mt-5 font-serif text-4xl">Panel de control</p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                    Ingresa al dashboard, revisa solicitudes activas y organiza
                    trabajadores sin perder el contexto del día.
                  </p>
                </div>

                <div
                  id="overview"
                  className="mt-5 grid gap-4 sm:grid-cols-3"
                >
                  {highlights.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[22px] border border-[#ece4d7] bg-[#fcfaf6] p-5"
                    >
                      <p className="text-2xl font-semibold text-[#8b6b31]">
                        {item.value}
                      </p>
                      <p className="mt-3 text-sm font-medium text-[#1f2937]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
