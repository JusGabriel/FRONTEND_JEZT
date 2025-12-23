import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import storeProfile from "./context/storeProfile";
import storeAuth from "./context/storeAuth";

// Layouts
import Dashboard from "./layout/Dashboard";

// Components
import Footer from "./components/principal/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import { Forgot } from "./pages/Forgot";
import { Confirm } from "./pages/Confirm";
import { NotFound } from "./pages/NotFound";
import Reset from "./pages/Reset";
import IA from "./pages/IA";
import Profile from "./pages/Profile";
import List from "./components/list/Table";
import Details from "./pages/Details";
import Whats from "./pages/Dashboard_whatsapp";
import Feeback from "./pages/QuejasSugerencias";
import Formularios from "./pages/Formularios";
import FormulariosEstudiante from "./pages/FormulariosEstudiante";
import StudentFeedbacks from "./pages/StudentFeedbacks";
import AddSingleQnA from "./pages/AddSingleQnA";
import ManageResponses from "./pages/ManageResponses";

// 🔹 Componente auxiliar para ocultar SOLO el footer en login y dashboard
const LayoutWithConditionalHeaderFooter = ({ children }) => {
  const location = useLocation();
  const { token } = storeAuth();

  // Rutas donde NO se debe mostrar el footer
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/forgot",
    "/reset",
    "/confirm",
    "/dashboard",
  ];

  const shouldHideFooter = token || hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
};

function App() {
  const { profile } = storeProfile();
  const { token } = storeAuth();

  useEffect(() => {
    if (token) profile();
  }, [token]);

  return (
    <BrowserRouter>
      <LayoutWithConditionalHeaderFooter>
        <Routes>
          {/* 🔹 Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot/:id" element={<Forgot />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="confirm/:token" element={<Confirm />} />
            <Route path="reset/:token" element={<Reset />} />
            <Route path="*" element={<NotFound />} />
          </Route>

         {/* 🔹 Rutas protegidas */}
          <Route
            path="dashboard/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route element={<Dashboard />}>
                    <Route index element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="listar" element={<List />} />
                    <Route path="visualizar/estudiante/:id" element={<Details />} />
                    <Route path="visualizar/pasante/:id" element={<Details />} />
                    <Route path="whatsapp" element={<Whats />} />
                    <Route path="preguntas" element={<Feeback />} />
                    <Route path="formularios" element={<Formularios />} />
                    <Route path="formularios/estudiante" element={<FormulariosEstudiante />} />
                    <Route path="ia" element={<IA />} />
                    <Route path="preguntas/estudiantes" element={<StudentFeedbacks />} />
                    <Route path="ia/agregarQnA" element={<AddSingleQnA />} />
                    <Route path="ia/actualizar-preguntas" element={<ManageResponses />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutWithConditionalHeaderFooter>
    </BrowserRouter>
  );
}

export default App;


