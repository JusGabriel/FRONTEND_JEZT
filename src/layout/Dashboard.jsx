import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import storeProfile from "../context/storeProfile";
import userIcon from "../assets/user.png";
import quejasIcon from "../assets/quejas.png";
import QaI from "../assets/asistente-ai.png";
import iaIcon from "../assets/ia.png";
import personasIcon from "../assets/personas.png";
import formulariosIcon from "../assets/formularios.png";
import mensajeroIcon from "../assets/mensajero.png";
// Asegúrate de que este archivo exista en tu carpeta assets
import hamburguesaIcon from "../assets/hamburgesa.png";
import Header from "../components/principal/Header";


const Dashboard = () => {
  const location = useLocation()
  const urlActual = location.pathname
  const { user } = storeProfile()

  // Estado para el sidebar en móvil
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Función para manejar el colapso
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Función para cerrar el menú móvil cuando se selecciona una ruta
  const handleMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  function getHDImage(url) {
    if (!url) return url;
    if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
        return url.replace(/=s\d+/, "=s1024");
    }
    return url; 
  }

  useEffect(() => {
    const link = document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

return (
  <>
  <Header/>
  <div className="flex h-[calc(100vh-48px)] font-sans flex-col md:flex-row" style={inputStyle}>
    {/* Botón hamburguesa en móvil */}
    <div className="md:hidden flex items-center justify-end gap-3 bg-gray-100 border-b border-gray-300 px-3 py-2 flex-shrink-0" style={{ fontFamily: "Gowun Batang, serif" }}>
      <h1 className="text-base font-bold text-[#17243D]">Jezt</h1>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#17243D]  transition duration-150 "
        title="Abrir menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 text-[#17243D] hover:text-gray-100"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>

    {/* Sidebar - Responsive */}
    <div 
      className={`fixed md:relative z-40 ${mobileMenuOpen ? 'left-0' : '-left-full'} md:left-auto ${isCollapsed ? 'md:w-16' : 'md:w-64'} w-16 bg-gray-100 p-4 border-r border-gray-300 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto h-[calc(100vh-48px)] md:h-[calc(100vh-48px)]`}
    >
<div className="flex flex-col mb-4">
  {/* Botón de hamburguesa arriba - Solo en desktop */}
  <div 
    onClick={toggleSidebar}
    className={`hidden md:flex h-10 w-10 bg-gray-200 rounded-full items-center justify-center cursor-pointer hover:bg-gray-300 transition duration-150 mb-2
      ${isCollapsed ? 'mx-auto' : 'ml-auto'}`}
    title="Toggle Sidebar"
  >
    <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 text-[#17243D] "
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
  </div>

  {/* Información del usuario - Siempre alineado a la izquierda, solo se muestra expandido */}
  {!isCollapsed && (
    <div className="flex items-center p-1">
      <div className="flex-shrink-0">
        <img
          src={getHDImage(user?.avatarUsuario) || "/usuarioSinfoto.jpg"}
          alt={`Avatar de ${user?.nombre || "Estudiante"}`}
          className="h-10 w-10 rounded-full object-cover border"
        />
      </div>

      <div className="ml-2">
        <p className="text-base font-semibold text-gray-800">
          ¡Bienvenido! {user?.nombre}
        </p>
        <p className="text-sm text-gray-600 mt-1">Rol: {user?.rol}</p>
      </div>
    </div>
  )}
</div>



      
      {/* Separador */}
      <hr className="border-gray-400 mb-4" />

      {/* Menú */}
      <ul className="space-y-2 text-sm flex-1 overflow-y-auto">
        {user && user.rol && (
          <>
            {/* Bloque Perfil y Configuración */}
            <li className="mb-3">
              <Link
                to="/dashboard"
                onClick={handleMenuItemClick}
                // Ajustamos las clases de flex-box para centrar en colapsado
                className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                  urlActual === "/dashboard"
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              >
                <img
                  src={userIcon}
                  alt="Usuario"
                  // Ajustamos el margen para el icono en colapsado
                  className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard" ? "filter invert" : ""}`}
                />
                {/* Ocultamos el texto al colapsar */}
                {!isCollapsed && "Perfil"}
              </Link>
            </li>

            <hr className="border-gray-300 my-2" />

            {/* Bloque Interacción */}
            {user.rol !== "pasante" && (
              <li className="mb-3">
                <Link
                  to="/dashboard/ia"
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual === "/dashboard/ia"
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={iaIcon}
                    alt="Chat IA"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/ia" ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Chat"}
                </Link>
              </li>
            )}

            {(user.rol !== "estudiante" || user.rol === "estudiante") && (
              <li className="mb-3">
                <Link
                  to={user.rol === "estudiante" ? "/dashboard/preguntas/estudiantes" : "/dashboard/preguntas"}
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual.includes("/preguntas")
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={quejasIcon}
                    alt="Quejas"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual.includes("/preguntas") ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Quejas/Sugerencias"}
                </Link>
              </li>
            )}

            {(user.rol === "administrador" || user.rol === "pasante") && (
              <li className="mb-3">
                <Link
                  to="/dashboard/whatsapp"
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual === "/dashboard/whatsapp"
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={mensajeroIcon}
                    alt="Mensajes"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/whatsapp" ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Mensajes"}
                </Link>
              </li>
            )}

            <hr className="border-gray-300 my-2" />

            {/* 🔹 Bloque especial para ESTUDIANTE */}
            {user.rol === "estudiante" && (
              <li className="mb-3">
                <Link
                  to="/dashboard/formularios/estudiante"
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual === "/dashboard/formularios/estudiante"
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={formulariosIcon}
                    alt="Formularios"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/formularios/estudiante" ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Formulario"}
                </Link>
              </li>
            )}

            {/* Bloque Administración */}
            {user.rol === "administrador" && (
              <>
                <li className="mb-3">
                  <Link
                    to="/dashboard/listar"
                    onClick={handleMenuItemClick}
                    className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                      urlActual === "/dashboard/listar"
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <img
                      src={personasIcon}
                      alt="Usuarios"
                      className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/listar" ? "filter invert" : ""}`}
                    />
                    {!isCollapsed && "Usuarios"}
                  </Link>
                </li>

                <li className="mb-3">
                  <Link
                    to="/dashboard/formularios"
                    onClick={handleMenuItemClick}
                    className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                      urlActual === "/dashboard/formularios"
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <img
                      src={formulariosIcon}
                      alt="Formularios"
                      className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/formularios" ? "filter invert" : ""}`}
                    />
                    {!isCollapsed && "Formularios"}
                  </Link>
                </li>
              </>
            )}

            {user.rol === "pasante" && (
              <>
              <li className="mb-3">
                <Link
                  to="/dashboard/ia/agregarQnA"
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual === "/dashboard/ia/agregarQnA"
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={iaIcon}
                    alt="Chat IA"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/ia/agregarQnA" ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Chat"}
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/dashboard/ia/actualizar-preguntas"
                  onClick={handleMenuItemClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-3'} py-2 rounded ${
                    urlActual === "/dashboard/ia/actualizar-preguntas"
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <img
                    src={QaI}
                    alt="Preguntas IA"
                    className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'} ${urlActual === "/dashboard/ia/actualizar-preguntas" ? "filter invert" : ""}`}
                  />
                  {!isCollapsed && "Preguntas IA"}
                </Link>
              </li>
               </>
            )}
          </>
        )}
      </ul>
    </div>
    {/* Contenido principal */}
    <div className="flex-1 flex flex-col bg-white w-full md:w-auto h-full overflow-auto">
      <Outlet />
    </div>
  </div>
  </>
);
}

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};


export default Dashboard
