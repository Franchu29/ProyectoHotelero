import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

// =========================
// TYPES
// =========================
type User = {
  id: number;
  nombre: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
};

// =========================
// CONTEXT
// =========================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================
// PROVIDER
// =========================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔵 VALIDAR SESIÓN (INTELIGENTE)
  // =========================
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔴 CLAVE: si no hay token, no llames al backend
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/me");

      setUser(res.data.user);
    } catch (error: any) {
      console.log("Sesión inválida o expirada");

      // limpia token inválido
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // =========================
  // 🟢 LOGIN
  // =========================
  const login = async (email: string, contrasena: string) => {
    try {
      const res = await api.post("/login", {
        email,
        contrasena,
      });

      const { token, user } = res.data;

      // guardar token
      localStorage.setItem("token", token);

      setUser(user);
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // =========================
  // 🔴 LOGOUT
  // =========================
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Error en logout (ignorable)");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// HOOK
// =========================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}