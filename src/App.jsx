import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import PrivateRouteWithRole from "./routes/PrivateRouteWithRole";
import PublicRoute from "./routes/PublicRoute";


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
import FormulariosEstudiante from "./pages/FormulariosEstudiante"; //  nuevo import
import StudentFeedbacks from "./pages/StudentFeedbacks";
import AddSingleQnA from "./pages/AddSingleQnA";
import ManageResponses from "./pages/ManageResponses";

// 🔹 Componente auxiliar para ocultar SOLO el footer en login y dashboard
const LayoutWithConditionalHeaderFooter = ({ children }) => {
  const location = useLocation();
  const { token } = storeAuth(); // detecta si hay sesión activa

  // Rutas donde NO se debe mostrar el footer
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/forgot",
    "/reset",
    "/confirm",
    "/dashboard", // oculta footer en todo el dashboard
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
            <Route path="reset-admin/:token" element={<Reset />} />
            <Route path="reset-pasante/:token" element={<Reset />} />
            <Route path="ia" element={<IA />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* 🔹 Rutas protegidas por rol */}
          <Route path="dashboard/*" element={<Dashboard />}>
            {/* ======== RUTAS PARA TODOS LOS ROLES ======== */}
            {/* Perfil */}
            <Route index element={
              <PrivateRouteWithRole allowedRoles={["administrador", "estudiante", "pasante"]}>
                <Profile />
              </PrivateRouteWithRole>
            } />
            
            {/* Visualizar detalles de estudiante */}
            <Route path="visualizar/estudiante/:id" element={
              <PrivateRouteWithRole allowedRoles={["administrador", "estudiante"]}>
                <Details />
              </PrivateRouteWithRole>
            } />
            
            {/* Visualizar detalles de pasante */}
            <Route path="visualizar/pasante/:id" element={
              <PrivateRouteWithRole allowedRoles={["administrador", "pasante"]}>
                <Details />
              </PrivateRouteWithRole>
            } />

            {/* ======== RUTAS SOLO PARA ADMINISTRADOR ======== */}
            {/* Listar usuarios */}
            <Route path="listar" element={
              <PrivateRouteWithRole allowedRoles={["administrador"]}>
                <List />
              </PrivateRouteWithRole>
            } />
            
            {/* WhatsApp */}
            <Route path="whatsapp" element={
              <PrivateRouteWithRole allowedRoles={["administrador", "pasante"]}>
                <Whats />
              </PrivateRouteWithRole>
            } />
            
            {/* Formularios */}
            <Route path="formularios" element={
              <PrivateRouteWithRole allowedRoles={["administrador"]}>
                <Formularios />
              </PrivateRouteWithRole>
            } />
            
            {/* Preguntas/Quejas */}
            <Route path="preguntas" element={
              <PrivateRouteWithRole allowedRoles={["administrador", "pasante"]}>
                <Feeback />
              </PrivateRouteWithRole>
            } />

            {/* ======== RUTAS SOLO PARA ESTUDIANTE ======== */}
            {/* Formulario especial estudiante */}
            <Route path="formularios/estudiante" element={
              <PrivateRouteWithRole allowedRoles={["estudiante"]}>
                <FormulariosEstudiante />
              </PrivateRouteWithRole>
            } />
            
            {/* Chat IA */}
            <Route path="ia" element={
              <PrivateRouteWithRole allowedRoles={["administrador", "estudiante"]}>
                <IA />
              </PrivateRouteWithRole>
            } />
            
            {/* Preguntas/Quejas - Estudiante */}
            <Route path="preguntas/estudiantes" element={
              <PrivateRouteWithRole allowedRoles={["estudiante"]}>
                <StudentFeedbacks />
              </PrivateRouteWithRole>
            } />

            {/* ======== RUTAS SOLO PARA PASANTE ======== */}
            {/* Agregar QnA */}
            <Route path="ia/agregarQnA" element={
              <PrivateRouteWithRole allowedRoles={["pasante"]}>
                <AddSingleQnA />
              </PrivateRouteWithRole>
            } />
            
            {/* Actualizar preguntas IA */}
            <Route path="ia/actualizar-preguntas" element={
              <PrivateRouteWithRole allowedRoles={["pasante"]}>
                <ManageResponses />
              </PrivateRouteWithRole>
            } />
          </Route>
        </Routes>
      </LayoutWithConditionalHeaderFooter>
    </BrowserRouter>
  );
}

export default App;

