import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ mientras valida sesión
  if (loading) return <p>Cargando...</p>;

  // 🔒 no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ autorizado
  return children;
}
