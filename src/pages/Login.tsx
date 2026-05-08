import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [modoRegistro, setModoRegistro] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // 🔵 LOGIN
  // =========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, contrasena); // 🔥 usa AuthContext

      // 🔥 redirección después de login exitoso
      navigate("/dashboard");

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🟢 REGISTRO
  // =========================
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/crear_usuario", {
        nombre,
        email,
        contrasena,
      });

      setModoRegistro(false); // volver a login
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-[#f5efe5] px-6 py-8 text-[#1f2937]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/65 shadow-[0_25px_80px_rgba(31,41,55,0.12)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden bg-[#1f2937] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#f2d59a]">
                Acceso seguro
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.04em]">
                Gestiona contratos con una entrada clara.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                Desde aquí el equipo puede ingresar, crear usuarios nuevos y
                volver a la portada principal cuando lo necesite.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-300">
                  Solicitudes, trabajadores y seguimiento operativo en un mismo
                  flujo.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Volver a la portada
              </Link>
            </div>
          </section>

          <section className="bg-[#fcfaf6] p-8 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <Link
                to="/"
                className="text-sm font-medium text-[#8b6b31] transition hover:text-[#6d5323] lg:hidden"
              >
                Volver a la portada
              </Link>

              <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#8b6b31]">
                {modoRegistro ? "Nuevo usuario" : "Bienvenido"}
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-[#1f2937]">
                {modoRegistro ? "Crear usuario" : "Iniciar sesión"}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#6b7280]">
                {modoRegistro
                  ? "Registra un nuevo acceso para el equipo y luego vuelve a iniciar sesión."
                  : "Ingresa con tu correo y contraseña para acceder al panel principal."}
              </p>

              <form
                onSubmit={modoRegistro ? handleRegistro : handleLogin}
                className="mt-10 flex flex-col gap-4"
              >
                {modoRegistro && (
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="rounded-2xl border border-[#dfd5c5] bg-white px-4 py-3 outline-none transition focus:border-[#c5a059]"
                    required
                  />
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border border-[#dfd5c5] bg-white px-4 py-3 outline-none transition focus:border-[#c5a059]"
                  required
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="rounded-2xl border border-[#dfd5c5] bg-white px-4 py-3 outline-none transition focus:border-[#c5a059]"
                  required
                />

                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 rounded-full bg-[#1f2937] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading
                    ? "Cargando..."
                    : modoRegistro
                    ? "Registrar"
                    : "Ingresar"}
                </button>

                <button
                  type="button"
                  className="rounded-full border border-[#d7c2a0] px-6 py-3 text-sm font-medium text-[#1f2937] transition hover:bg-white"
                  onClick={() => {
                    setModoRegistro(!modoRegistro);
                    setError("");
                  }}
                >
                  {modoRegistro ? "Volver al login" : "Crear usuario"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
