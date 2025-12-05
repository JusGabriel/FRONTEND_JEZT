import { MdDeleteForever, MdInfo, MdMessage, MdReply, MdCheckCircle, MdPending } from "react-icons/md";
import useFetch from "../hooks/useFetch";
import storeAuth from '../context/storeAuth';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import storeProfile from '../context/storeProfile';
const FeedbacksTable = () => {
  const { fetchDataBackend } = useFetch();
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchFeedbacks, setSearchFeedbacks] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos"); // 🔹 Filtro por categoría
  const [paginaFeedbacks, setPaginaFeedbacks] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [feedbackSeleccionado, setFeedbackSeleccionado] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const ITEMS_POR_PAGE = 10;

  const navigate = useNavigate();

  const token = storeAuth.getState().token;
  
  const { user } = storeProfile();
  const userRole = user?.rol;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Obtener todos los feedbacks
const listarFeedbacks = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/admin/feedback/all`;
  try {
    const response = await fetchDataBackend(url, null, "GET", getHeaders());

    let feedbacksArray = [];
    
    // 🔹 MANEJAR DIFERENTES ESTRUCTURAS DE RESPUESTA
    if (response && response.status === 'success') {
      if (response.data && Array.isArray(response.data.feedbacks)) {
        // Estructura: { status: 'success', data: { feedbacks: [...] } }
        feedbacksArray = response.data.feedbacks;
        
      } else if (response.data && Array.isArray(response.data)) {
        // Estructura: { status: 'success', data: [...] }
        feedbacksArray = response.data;
    
      } else if (Array.isArray(response.data)) {
        // Estructura: { status: 'success', data: [...] } (alternativa)
        feedbacksArray = response.data;
        
      }
    } else if (Array.isArray(response)) {
      // Estructura: [...] (array directo)
      feedbacksArray = response;
     
    } 
    setFeedbacks(feedbacksArray);
    
  } catch (e) {
    setFeedbacks([]);
  }
};

  // Obtener estadísticas
const obtenerEstadisticas = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/admin/feedback/stats`;
  try {
    const data = await fetchDataBackend(url, null, "GET", getHeaders());
    console.info("Estadísticas:", data);
  } catch (e) {
    console.error("Error al obtener estadísticas");
  }
};

  // Responder a un feedback (solo admin)
  const responderFeedback = async (feedbackId, respuesta) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/admin/feedback/respond/${feedbackId}`;
    try {
      const response = await fetchDataBackend(
        url,
        { responseText: respuesta },
        "PATCH",
        getHeaders()
      );
      
      if (response) {
        toast.success("Respuesta enviada correctamente");
        setModalAbierto(false);
        setRespuesta("");
        listarFeedbacks();
      }
    } catch (e) {
      toast.error("Error al enviar la respuesta");
    }
  };

  // Eliminar feedback (solo admin)
  const eliminarFeedback = async (id) => {
    const ok = confirm("¿Desea eliminar esta queja o sugerencia?");
    if (!ok) return;
    
    const url = `${import.meta.env.VITE_BACKEND_URL}/admin/feedback/${id}`;
    try {
      const resp = await fetch(url, { 
        method: "DELETE", 
        headers: getHeaders() 
      });
      
      if (!resp.ok) {
        toast.error("No se pudo eliminar la queja o sugerencia");
        return;
      }
      
      toast.success("Queja o sugerencia eliminada correctamente");
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar queja o sugerencia");
    }
  };

  // Abrir modal para responder
  const abrirModalResponder = (feedback) => {
    if (userRole === "pasante") {
      toast.warning("Los pasantes no pueden responder quejas o sugerencias");
      return;
    }
    setFeedbackSeleccionado(feedback);
    setRespuesta(feedback.response?.text || "");
    setModalAbierto(true);
  };

  // Enviar respuesta
  const enviarRespuesta = () => {
    if (!respuesta.trim()) {
      toast.error("La respuesta no puede estar vacía");
      return;
    }
    
    if (feedbackSeleccionado) {
      responderFeedback(feedbackSeleccionado._id, respuesta);
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      await listarFeedbacks();
      await obtenerEstadisticas();
    })();
  }, [token]);

  useEffect(() => {
    setPaginaFeedbacks(1);
  }, [searchFeedbacks, filtroActivo]);

  if (!token) return <p>Debes iniciar sesión para ver esta tabla.</p>;

  const headers = ["N°", "Estudiante", "Categoría", "Descripción", "Fecha", "Estado", "Acciones"];

  // Filtrar feedbacks por búsqueda y categoría
  const filteredFeedbacks = feedbacks.filter((f) => {
    const coincideBusqueda = `${f.studentName} ${f.description}`
      .toLowerCase()
      .includes(searchFeedbacks.toLowerCase());
    
    const coincideCategoria = filtroActivo === "todos" || f.category === filtroActivo;
    
    return coincideBusqueda && coincideCategoria;
  });

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
      <div className="w-full bg-white px-4 py-6 flex flex-col" style={{ fontFamily: "Gowun Batang, serif" }}>
        <div>
          <h1 className='font-black text-4xl text-[#17243D] mt-2'>Quejas y Sugerencias</h1>
          <hr className='my-4 border-t-2 border-[#17243D]' />
          <p className='mb-8 text-[#17243D]'>
            Este módulo te permite gestionar todas las quejas y sugerencias de los estudiantes
          </p>
        </div>

        <ToastContainer />

        {/* 🔹 Filtros por categoría */}
        <div className="flex justify-center gap-6 mt-6 mb-6">
          <button
            onClick={() => setFiltroActivo("Queja")}
            className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm
              ${
                filtroActivo === "Queja"
                  ? "bg-[#17243D] text-white"
                  : "bg-gray-200 text-[#17243D] hover:bg-[#EF3340] hover:text-white"
              }`}
          >
            Quejas
          </button>

          <button
            onClick={() => setFiltroActivo("Sugerencia")}
            className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm
              ${
                filtroActivo === "Sugerencia"
                  ? "bg-[#17243D] text-white"
                  : "bg-gray-200 text-[#17243D] hover:bg-[#EF3340] hover:text-white"
              }`}
          >
            Sugerencias
          </button>
        </div>

        {/* 🔹 Encabezado con buscador */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <div className="relative w-[450px]">
            <input
              type="text"
              placeholder="Buscar por estudiante o descripción..."
              className="w-full py-2 pl-4 pr-4 rounded-xl shadow-md border border-gray-200 focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none text-[#00000] placeholder-gray-400 transition-all bg-transparent"
              value={searchFeedbacks}
              onChange={(e) => setSearchFeedbacks(e.target.value)}
            />
          </div>
        </div>
        
        <hr className='my-4 border-t-2 border-[#dee2e6]' />

        {/* 🔹 Tabla de feedbacks */}
        <TablaFeedbacks
          data={filteredFeedbacks}
          headers={headers}
          onRespond={abrirModalResponder}
          onDelete={eliminarFeedback}
          userRole={userRole}
          paginaActual={paginaFeedbacks}
          itemsPorPagina={ITEMS_POR_PAGE}
        />

        {/* 🔹 Paginación */}
        <Paginacion
          totalItems={filteredFeedbacks.length}
          itemsPerPage={ITEMS_POR_PAGE}
          paginaActual={paginaFeedbacks}
          setPaginaActual={setPaginaFeedbacks}
        />

        {/* 🔹 Modal para responder */}
        {modalAbierto && feedbackSeleccionado && (
          <ModalResponder
            feedback={feedbackSeleccionado}
            respuesta={respuesta}
            setRespuesta={setRespuesta}
            onClose={() => setModalAbierto(false)}
            onEnviar={enviarRespuesta}
          />
        )}
      </div>
    </>
  );
};

// 🔹 Componente Modal para Responder
const ModalResponder = ({ feedback, respuesta, setRespuesta, onClose, onEnviar }) => {
  return (
<div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">


      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-[#17243D] mb-4">Responder Queja</h2>
        <hr className="mb-6 border-gray-300" />

        {/* Información del feedback */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Estudiante:</span>
            <span className="bg-[#A1D5D3] text-[#17243D] px-2 py-1 rounded">
              {feedback.studentName}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fecha:</span>
            <span className="bg-[#A1D5D3] text-gray-800 px-2 py-1 rounded">
              {new Date(feedback.date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">Categoría:</span>
            <span className={`px-2 py-1 rounded ${
              feedback.category === 'Queja' 
                ? 'bg-[#A1D5D3] text-[#17243D]' 
                : 'bg-[#A1D5D3] text-[#17243D]'
            }`}>
              {feedback.category}
            </span>
          </div>
          
          <div>
            <span className="font-semibold">Descripción:</span>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
              {feedback.description}
            </div>
          </div>
        </div>
        <hr className="mb-6 border-gray-300" />


        {/* Área de respuesta */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Tu respuesta:</label>
          <textarea
            value={respuesta}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setRespuesta(e.target.value);
              }
            }}
            placeholder="Escribe tu respuesta aquí..."
            maxLength="100"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {respuesta.length}/100
          </div>
        </div>
          <hr className="mb-6 border-gray-300" />


        {/* Botones del modal */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onEnviar}
            className="px-4 py-2 bg-[#17243D] text-white rounded-lg hover:bg-[#EF3340] transition-colors"
          >
            Enviar Respuesta
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Componente de Tabla de Feedbacks
const TablaFeedbacks = ({ data, headers, onRespond, onDelete, userRole, paginaActual = 1, itemsPorPagina = 10 }) => {
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const dataPagina = Array.isArray(data) ? data.slice(inicio, fin) : [];

  // Función para truncar texto largo
  const truncarTexto = (texto, maxLength = 50) => {
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + "...";
  };

  return (
    <div className="relative shadow-lg bg-[#dee2e6] mt-3 mb-10 overflow-y-auto">
      <table
        className="w-full table-auto text-sm"
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
            dataPagina.map((f, i) => (
              <tr
                key={f._id}
                className="bg-[#dee2e6] text-[#17243D] hover:bg-[#d1d5dc] hover:text-black text-center transition-all"
              >
                <td className="py-2">{inicio + i + 1}</td>
                <td className="py-2 font-medium">{f.studentName}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    f.category === 'Queja' 
                      ? 'bg-[#a1d5d3] text-[#17243D]' 
                      : 'bg-[#a1d5d3] text-[#17243D]'
                  }`}>
                    {f.category}
                  </span>
                </td>
                <td className="py-2 text-left px-3">
                  {truncarTexto(f.description)}
                </td>
                <td className="py-2">
                  {new Date(f.date).toLocaleDateString()}
                </td>
                <td className="py-2">
                  <div className="flex items-center justify-center gap-1">
                    {f.status === 'Respondido' ? (
                      <MdCheckCircle className="text-[#20B2AA] text-lg" />
                    ) : (
                      <MdPending className="text-yellow-500 text-lg" />
                    )}
                    <span className={`text-xs font-medium ${
                      f.status === 'Respondido' ? 'text-[#17243D]' : 'text-[#17243D]'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center justify-center gap-3">
                    <MdReply
                      title="Responder"
                      className={`h-6 w-6 cursor-pointer ${
                        userRole === "pasante" 
                          ? "text-gray-400  cursor-pointer" 
                          : "cursor-pointer"
                      }`}
                      onClick={() => onRespond(f)}
                    />
                    {userRole === "administrador" && (
                      <MdDeleteForever
                        title="Eliminar"
                        className="h-6 w-6 cursor-pointer "
                        onClick={() => onDelete(f._id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-400">
                No hay quejas o sugerencias registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// 🔹 Componente de Paginación (el mismo que tenías)
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
    <div className="flex justify-center gap-3 mt-4 mb-10">
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

// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default FeedbacksTable;