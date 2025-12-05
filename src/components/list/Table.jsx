import { MdDeleteForever, MdInfo, MdMessage, MdSwapHoriz } from "react-icons/md";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import storeAuth from "../../context/storeAuth";

const Table = () => {
  const { fetchDataBackend } = useFetch();
  const [estudiantes, setEstudiantes] = useState([]);
  const [pasantes, setPasantes] = useState([]);
  const [searchEstudiantes, setSearchEstudiantes] = useState("");
  const [searchPasantes, setSearchPasantes] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("estudiantes"); // 🔹 Nuevo filtro
  const navigate = useNavigate();

  // PAGINACIÓN: estados separados para cada tipo
  const [paginaEstudiantes, setPaginaEstudiantes] = useState(1);
  const [paginaPasantes, setPaginaPasantes] = useState(1);
  const ITEMS_POR_PAGE = 10;

  
  const { token } = storeAuth();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const cambiarRolPasante = async (id) => {
    const ok = confirm("¿Convertir este estudiante en pasante?");
    if (!ok) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/cambiar-rol-pasante/${id}`;
    try {
      const resp = await fetch(url, { method: "PUT", headers: getHeaders() });
      if (!resp.ok) {
        toast.error("No se pudo cambiar el rol");
        return;
      }
      toast.success("Rol cambiado a pasante");
      await listarEstudiantes();
      await listarPasantes();
    } catch (e) {
      console.error(e);
      toast.error("Error al cambiar el rol");
    }
  };

  const listarEstudiantes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes`;
    try {
      const data = await fetchDataBackend(url, null, "GET", getHeaders());
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al listar estudiantes:", e);
      setEstudiantes([]);
    }
  };

  const listarPasantes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/pasantes`;
    try {
      const data = await fetchDataBackend(url, null, "GET", getHeaders());
      setPasantes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al listar pasantes:", e);
      setPasantes([]);
    }
  };

  const banEstudiante = async (id) => {
    const ok = confirm("¿Banear a este estudiante?");
    if (!ok) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/banear/${id}`;
    try {
      const resp = await fetch(url, { method: "DELETE", headers: getHeaders() });
      if (!resp.ok) {
        toast.error("No se pudo banear al estudiante");
        return;
      }
      toast.success("Estudiante baneado");
      setEstudiantes((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al banear estudiante");
    }
  };

  const banPasante = async (id) => {
    const ok = confirm("¿Eliminar a este pasante?");
    if (!ok) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/pasante/banear/${id}`;
    try {
      const resp = await fetch(url, { method: "DELETE", headers: getHeaders() });
      if (!resp.ok) {
        toast.error("No se pudo eliminar al pasante");
        return;
      }
      toast.success("Pasante eliminado correctamente");
      setPasantes((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar pasante");
    }
  };

 const goMessage = (numero) => {
  if (!numero) {
    toast.info("Este estudiante no tiene número registrado");
    return;
  }

  navigate("/dashboard/whatsapp", {
    state: { numero },
  });
};




  const goInfo = (id, tipo) => {
    if (tipo === "estudiante") {
      navigate(`/dashboard/visualizar/estudiante/${id}`);
    } else if (tipo === "pasante") {
      navigate(`/dashboard/visualizar/pasante/${id}`);
    } else {
      toast.error("Tipo de usuario desconocido");
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      await listarEstudiantes();
      await listarPasantes();
    })();
  }, [token]);

  // cuando cambian búsquedas, volver a la página 1 correspondiente
  useEffect(() => {
    setPaginaEstudiantes(1);
  }, [searchEstudiantes]);

  useEffect(() => {
    setPaginaPasantes(1);
  }, [searchPasantes]);

  if (!token) return <p>Debes iniciar sesión para ver esta tabla.</p>;

  const headers = ["N°", "Nombre completo", "Usuario", "Correo", "Estado", "Acciones"];

  const filteredEstudiantes = estudiantes.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.username}`.toLowerCase().includes(searchEstudiantes.toLowerCase())
  );

  const filteredPasantes = pasantes.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.username}`.toLowerCase().includes(searchPasantes.toLowerCase())
  );

  useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      }, []);

  return (
    <>
      <div className="w-full bg-white px-10 py-2 flex flex-col" style={{ fontFamily: "Gowun Batang, serif" }} >
            <div>
                <h1 className='font-black text-4xl text-[text-[#17243D] mt-2'>Usuarios</h1>
                <hr className='my-4 border-t-2 border-[#17243D]' />
                <p className='mb-2 text-[#17243D]'>Este módulo te permite gestionar todos los usuarios del sistema</p>
            </div>

      <ToastContainer />

      {/* 🔹 Filtros simples para cambiar entre Estudiantes / Pasantes */}
      <div className="flex justify-center gap-6 mt-6 mb-6">
        <button
          onClick={() => setFiltroActivo("estudiantes")}
          className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm
            ${
              filtroActivo === "estudiantes"
                ? "bg-[#17243D] text-white"
                : "bg-gray-200 text-[#17243D] hover:bg-[#EF3340] hover:text-white"
            }`}
        >
          Estudiantes
        </button>

        <button
          onClick={() => setFiltroActivo("pasantes")}
          className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm
            ${
              filtroActivo === "pasantes"
                ? "bg-[#17243D] text-white"
                : "bg-gray-200 text-[#17243D] hover:bg-[#EF3340] hover:text-white"
            }`}
        >
          Pasantes
        </button>
      </div>



      {/* 🔹 Mostrar solo la tabla del filtro activo */}
      {filtroActivo === "estudiantes" && (
        <>
          {/* 🔹 Encabezado de sección */}
          <div className="flex items-center justify-between mt-5 mb-4">
            {/* 🔹 Buscador */}
            <div className="relative w-[450px]">
              <input
                type="text"
                placeholder="Buscar estudiante "
                className="w-full py-2 pl-4 pr-4 rounded-xl shadow-md border border-gray-200 focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none text-[#00000] placeholder-gray-400 transition-all bg-transparent"
                value={searchEstudiantes}
                onChange={(e) => setSearchEstudiantes(e.target.value)}
              />
            </div>
          </div>
            <hr className='my-4 border-t-2 border-[#dee2e6]' />


          {/* 🔹 Tabla de estudiantes */}
          <TablaUsuarios
            data={filteredEstudiantes}
            headers={[...headers, "Rol"]}
            onInfo={goInfo}
            onMessage={goMessage}
            onBan={banEstudiante}
            onChangeRol={cambiarRolPasante}
            tipo="estudiante"
            paginaActual={paginaEstudiantes}
            itemsPorPagina={ITEMS_POR_PAGE}
          />

          {/* 🔹 Paginación estudiantes */}
          <Paginacion
            totalItems={filteredEstudiantes.length}
            itemsPerPage={ITEMS_POR_PAGE}
            paginaActual={paginaEstudiantes}
            setPaginaActual={setPaginaEstudiantes}
          />
        </>
      )}


      {filtroActivo === "pasantes" && (
        <>
          {/* 🔹 Encabezado de sección */}
          <div className="flex items-center justify-between mt-5 mb-4">

            {/* 🔹 Controles (botón + buscador) */}
            <div className="flex items-center gap-4">


              {/* Buscador */}
              <div className="relative w-[450px]">
                <input
                  type="text"
                  placeholder="Buscar pasante"
                  className="w-full py-2 pl-4 pr-4 rounded-xl shadow-md border border-gray-200 focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none text-[#000] placeholder-gray-400 transition-all bg-transparent"
                  value={searchPasantes}
                  onChange={(e) => setSearchPasantes(e.target.value)}
                />               
              </div>  
              {/* Botón "Nuevo" eliminado */}
           
            </div>
          </div>
          <hr className='my-4 border-t-2 border-[#dee2e6]' />


          {/* 🔹 Tabla de pasantes */}
          <TablaUsuarios
            data={filteredPasantes}
            headers={headers}
            onInfo={goInfo}
            onMessage={goMessage}
            onBan={banPasante}
            tipo="pasante"
            paginaActual={paginaPasantes}
            itemsPorPagina={ITEMS_POR_PAGE}
          />

          {/* 🔹 Paginación pasantes */}
          <Paginacion
            totalItems={filteredPasantes.length}
            itemsPerPage={ITEMS_POR_PAGE}
            paginaActual={paginaPasantes}
            setPaginaActual={setPaginaPasantes}
          />
        </>
        
      )}
      </div>
    </>
  );
};

const Paginacion = ({ totalItems, itemsPerPage, paginaActual, setPaginaActual }) => {
  const totalPaginas = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const maxButtons = Math.min(totalPaginas, 5);
  const botones = Array.from({ length: maxButtons }, (_, i) => i + 1);

  const handlePrev = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handleNext = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <div className="flex justify-center gap-3 mt-4 mb-4">
      {/* Anterior */}
      <button
        onClick={handlePrev}
        disabled={paginaActual === 1}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          paginaActual === 1
            ? "bg-white border border-gray-200 text-gray-300 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-500 hover:bg-[#20B2AA] hover:text-white"
        }`}
      >
        &lt;
      </button>

      {botones.map((num) => (
        <button
          key={num}
          onClick={() => setPaginaActual(num)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
            paginaActual === num
              ? "bg-[#20B2AA] text-white"
              : "bg-white border border-gray-300 text-gray-500 hover:bg-[#20B2AA] hover:text-white"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Siguiente */}
      <button
        onClick={handleNext}
        disabled={paginaActual === totalPaginas}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          paginaActual === totalPaginas
            ? "bg-white border border-gray-200 text-gray-300 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-500 hover:bg-[#20B2AA] hover:text-white"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

const TablaUsuarios = ({ data, headers, onInfo, onMessage, onBan, onChangeRol, tipo, paginaActual = 1, itemsPorPagina = 10 }) => {
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const dataPagina = Array.isArray(data) ? data.slice(inicio, fin) : [];

  return (
    <div className="relative shadow-lg bg-[#dee2e6] mt-3 mb-4 w-full md:overflow-visible overflow-x-auto">
      <table
        className="w-full table-auto text-sm md:min-w-0 min-w-[600px]"
        style={{ fontFamily: "Gowun Batang, serif" }}
      >
        <thead className="sticky top-0 bg-[#17243D] text-white text-xs z-10">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3 text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(dataPagina) && dataPagina.length > 0 ? (
            dataPagina.map((u, i) => (
              <tr
                key={u._id}
                className="bg-[#dee2e6] text-[#17243D] hover:bg-[#d1d5dc] hover:text-black text-center transition-all"
              >
                <td className="py-2">{inicio + i + 1}</td>
                <td className="py-2">{`${u.nombre} ${u.apellido}`}</td>
                <td className="py-2">{u.username || "—"}</td>
                <td className="py-2">{u.email || "—"}</td>
                <td className="py-2">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.status ? "bg-[#20B2AA]" : "bg-red-500"
                      }`}
                    />
                    <p className="text-xs font-medium">
                      {u.status ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center justify-center gap-3">
                    <MdInfo
                      title="Ver información"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onInfo(u._id, tipo)}
                    />
                    <MdMessage
                      title="Enviar mensaje"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onMessage(u.numero)}
                    />
                    <MdDeleteForever
                      title="Eliminar/Banear"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onBan(u._id)}
                    />
                    {/* Solo para estudiantes: ícono para cambiar rol */}
                    {tipo === "estudiante" && (
                      <MdSwapHoriz
                        title="Convertir en pasante"
                        className="h-6 w-6 cursor-pointer text-[#20B2AA]"
                        onClick={() => onChangeRol(u._id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-400">
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default Table;
