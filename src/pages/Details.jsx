import { useEffect, useState } from "react";
import storeAuth from '../context/storeAuth';
import { useParams, useLocation } from "react-router";
import useFetch from "../hooks/useFetch";
import { ToastContainer } from "react-toastify";

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchDataBackend } = useFetch();

  // 🔹 Detectar tipo según URL
  const tipo = location.pathname.includes("/estudiante/")
    ? "estudiante"
    : location.pathname.includes("/pasante/")
    ? "pasante"
    : null;

  // 🔹 Función para obtener los datos
  const obtenerDetalle = async () => {
    if (!tipo) {
      console.error("Tipo de detalle desconocido");
      setLoading(false);
      return;
    }

    try {
      const token = storeAuth.getState().token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const url = `${import.meta.env.VITE_BACKEND_URL}/${tipo}/detalle/${id}`;
      const data = await fetchDataBackend(url, null, "GET", headers);
      setUsuario(data);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    obtenerDetalle();

    return () => {
      document.head.removeChild(link);
    };
  }, [id]);

  const getHDImage = (url) => {
    if (!url) return url;
    if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
      return url.replace(/=s\d+/, "=s1024");
    }
    return url;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400 text-lg font-semibold">
        Cargando datos del {tipo}...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6 text-center text-red-500 text-lg font-semibold">
        No se encontró información del {tipo}.
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="w-full bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8 flex flex-col" style={inputStyle}>
        {/* Encabezado */}
        <div className="w-full mb-12">
          <h1 className="font-black text-4xl text-[#17243D] mt-2">Visualizar {tipo === "estudiante" ? "Estudiante" : "Pasante"}</h1>
          <hr className="my-4 border-t-2 border-[#17243D]" />
          <p className="mb-8 text-[#17243D] text-lg">
            Este módulo te permite visualizar todos los datos del {tipo === "estudiante" ? "estudiante" : "pasante"} seleccionado.
          </p>
        </div>

        {/* Card principal */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex-1">
            <ul className="list-disc pl-6 space-y-4 text-[#17243D]" >
              <li><span className="font-semibold">Nombre: </span>{usuario?.nombre || "No disponible"}</li>
              <li><span className="font-semibold">Apellido: </span>{usuario?.apellido || "No disponible"}</li>
              <li><span className="font-semibold">Correo electrónico: </span>{usuario?.email || "No disponible"}</li>
              <li><span className="font-semibold">Usuario: </span>{usuario?.username || "No disponible"}</li>
              {usuario?.numero && <li><span className="font-semibold">Número: </span>{usuario.numero}</li>}
              {usuario?.carrera && <li><span className="font-semibold">Carrera: </span>{usuario.carrera}</li>}
              <li>
                <span className="font-semibold">Estado: </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  usuario.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {usuario.status ? "Activo" : "Inactivo"}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex-shrink-0 self-center md:self-start">
            <img
              src={getHDImage(usuario?.avatarUsuario) || "/src/assets/usuarioSinfoto.jpg"}
              alt={`Avatar de ${usuario?.nombre || "usuario"}`}
              className="h-56 w-56 rounded-full object-cover shadow-md border-4 border-gray-200"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const inputStyle = { fontFamily: "Gowun Batang, serif" };

export default Details;
