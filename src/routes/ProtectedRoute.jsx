import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";

const ProtectedRoute = ({ children }) => {
  const token = storeAuth((state) => state.token);
  const loading = storeProfile((state) => state.loading);

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si está cargando el perfil, mostrar mensaje o loader
  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  // Si todo está bien, renderizar los hijos
  return children;
};

export default ProtectedRoute;


