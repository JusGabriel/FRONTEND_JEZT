import { MdAdd, MdCheckCircle, MdPending, MdInfo } from "react-icons/md";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import storeAuth from '../context/storeAuth';

const StudentFeedbacks = () => {
  const { fetchDataBackend } = useFetch();
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [searchFeedbacks, setSearchFeedbacks] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [paginaFeedbacks, setPaginaFeedbacks] = useState(1);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [feedbackSeleccionado, setFeedbackSeleccionado] = useState(null);
  const [nuevoFeedback, setNuevoFeedback] = useState({
    category: "Queja",
    description: ""
  });
  const [userName, setUserName] = useState("");
  const ITEMS_POR_PAGE = 10;

  const token = storeAuth.getState().token;
  
  
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Obtener los feedbacks del estudiante
const listarMisFeedbacks = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/feedback/my-feedbacks`;
  try {
    const response = await fetchDataBackend(url, null, "GET", getHeaders());
    // 🔹 CORREGIDO: Manejar la estructura correcta de respuesta
    if (response && response.status === 'success' && response.data) {
      if (Array.isArray(response.data.feedbacks)) {
        setMyFeedbacks(response.data.feedbacks);
        if (response.data.feedbacks.length > 0) {
          setUserName(response.data.feedbacks[0].studentName || 'Estudiante');
        }
      } else if (Array.isArray(response.data)) {
        setMyFeedbacks(response.data);
        if (response.data.length > 0) {
          setUserName(response.data[0].studentName || 'Estudiante');
        }
      } else {
        setMyFeedbacks([]);
      }
    } else if (Array.isArray(response)) {
      setMyFeedbacks(response);
      
      if (response.length > 0) {
        setUserName(response[0].studentName || 'Estudiante');
      }
    } else {
      setMyFeedbacks([]);
    }
    
  } catch (e) {
    setMyFeedbacks([]);
  }
};

  // Crear nuevo feedback - RUTA CORREGIDA
  const crearFeedback = async () => {
    if (!nuevoFeedback.description.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}/feedback`;
    try {
      const response = await fetchDataBackend(
        url,
        nuevoFeedback,
        "POST",
        getHeaders()
      );
      
      if (response) {
        toast.success("Queja o sugerencia enviada correctamente");
        setModalCrearAbierto(false);
        setNuevoFeedback({ category: "Queja", description: "" });
        listarMisFeedbacks();
      }
    } catch (e) {
      toast.error("Error al enviar queja o sugerencia");
    }
  };

  // Ver detalles de un feedback
  const verDetalles = (feedback) => {
    setFeedbackSeleccionado(feedback);
    setModalDetalleAbierto(true);
  };

  useEffect(() => {
    if (!token) return;
    listarMisFeedbacks();
  }, [token]);

  useEffect(() => {
    setPaginaFeedbacks(1);
  }, [searchFeedbacks, filtroActivo]);

  if (!token) return <p>Debes iniciar sesión para ver esta página.</p>;

  const headers = ["N°", "Categoría", "Descripción", "Fecha", "Estado", "Acciones"];

  // Filtrar feedbacks
  const filteredFeedbacks = myFeedbacks.filter((f) => {
    const coincideBusqueda = f.description
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
      <div className="bg-white min-h-full px-4 py-16" style={inputSyle}>
        <div>
          <h1 className='font-black text-4xl text-[#17243D] mt-2'>Mis Quejas y Sugerencias</h1>
          <hr className='my-4 border-t-2 border-[#17243D]' />
          <p className='mb-8 text-[#17243D]'>
            En este módulo puedes enviar tus quejas y sugerencias, y ver el estado de las mismas
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
            Mis Quejas
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
            Mis Sugerencias
          </button>
        </div>

        {/* 🔹 Encabezado con buscador y botón crear */}
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 mt-5 mb-4">
          <div className="relative w-full md:w-[450px]">
            <input
              type="text"
              placeholder="Buscar queja o sugerencia..."
              className="w-full py-2 pl-4 pr-4 rounded-xl shadow-md border border-gray-200 focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none text-[#00000] placeholder-gray-400 transition-all bg-transparent"
              value={searchFeedbacks}
              onChange={(e) => setSearchFeedbacks(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <button
              onClick={() => setModalCrearAbierto(true)}
              className="flex items-center justify-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-3 py-2 md:px-6 md:py-3 rounded-lg font-medium transition shadow-md text-sm md:text-base"
            >
              <MdAdd className="text-lg md:text-xl" />
              <span className="hidden md:inline"> Nueva Queja o Sugerencia</span>
              <span className="md:hidden"> Nueva Queja o Sugerencia</span>
            </button>
          </div>
        </div>
        
        <hr className='my-4 border-t-2 border-[#dee2e6]' />

        <TablaMisFeedbacks
          data={filteredFeedbacks}
          headers={headers}
          onViewDetails={verDetalles}
          paginaActual={paginaFeedbacks}
          itemsPorPagina={ITEMS_POR_PAGE}
        />

        <Paginacion
          totalItems={filteredFeedbacks.length}
          itemsPerPage={ITEMS_POR_PAGE}
          paginaActual={paginaFeedbacks}
          setPaginaActual={setPaginaFeedbacks}
        />

        {modalCrearAbierto && (
          <ModalCrearFeedback
            nuevoFeedback={nuevoFeedback}
            setNuevoFeedback={setNuevoFeedback}
            onClose={() => setModalCrearAbierto(false)}
            onCrear={crearFeedback}
            userName={userName}
          />
        )}

        {modalDetalleAbierto && feedbackSeleccionado && (
          <ModalDetalleFeedback
            feedback={feedbackSeleccionado}
            onClose={() => setModalDetalleAbierto(false)}
          />
        )}
      </div>
    </>
  );
};

// 🔹 Modal para Crear Feedback (actualizado para manejar nombre vacío)
const ModalCrearFeedback = ({ nuevoFeedback, setNuevoFeedback, onClose, onCrear, userName }) => {

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-[#17243D] mb-4">Nueva Queja/Sugerencia</h2>
        <hr className="mb-6 border-gray-300" />

        {/* Información del estudiante */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Estudiante:</span>
            <span className="bg-[#A1D5D3] text-[#17243D] px-2 py-1 rounded">
              {userName || "Estudiante"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fecha:</span>
            <span className="bg-[#A1D5D3] text-gray-800 px-2 py-1 rounded">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Selección de categoría */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Tipo:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Queja"
                checked={nuevoFeedback.category === "Queja"}
                onChange={(e) => setNuevoFeedback({...nuevoFeedback, category: e.target.value})}
                className="text-[#17243D] focus:ring-[#17243D]"
              />
              <span className="bg-[#A1D5D3] text-[#17243D] px-3 py-1 rounded-full font-medium">
                Queja
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Sugerencia"
                checked={nuevoFeedback.category === "Sugerencia"}
                onChange={(e) => setNuevoFeedback({...nuevoFeedback, category: e.target.value})}
                className="text-[#17243D] focus:ring-[#17243D]"
              />
              <span className="bg-[#A1D5D3] text-[#17243D] px-3 py-1 rounded-full font-medium">
                Sugerencia
              </span>
            </label>
          </div>
        </div>
        <hr className="mb-6 border-gray-300" />

        {/* Área de descripción */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Detalle:
          </label>
          <textarea
            value={nuevoFeedback.description}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setNuevoFeedback({...nuevoFeedback, description: e.target.value});
              }
            }}
            placeholder="Escribe tu queja o sugerencia..."
            maxLength="100"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA] focus:outline-none resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {nuevoFeedback.description.length}/100
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
            onClick={onCrear}
            className="px-4 py-2 bg-[#17243D] text-white rounded-lg hover:bg-[#EF3340] transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Modal para Ver Detalles del Feedback (sin cambios)
const ModalDetalleFeedback = ({ feedback, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold text-[#17243D] mb-4">Detalles de tu {feedback.category.toLowerCase()}</h2>
        
        {/* Información del feedback */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Categoría:</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                feedback.category === 'Queja' 
                  ? 'bg-blue-50 text-[#17243D]' 
                  : 'bg-blue-50 text-[#17243D]'
              }`}>
                {feedback.category}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">Estado:</span>
              <div className="flex items-center gap-1">
                {feedback.status === 'Respondido' ? (
                  <MdCheckCircle className="text-[#20B2AA] text-lg" />
                ) : (
                  <MdPending className="text-yellow-500 text-lg" />
                )}
                <span className={`text-sm font-medium ${
                  feedback.status === 'Respondido' ? 'text-[#17243D]' : 'text-[#17243D]'
                }`}>
                  {feedback.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-semibold">Fecha de envío:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded border">
              {new Date(feedback.date).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div>
            <span className="font-semibold">Tu {feedback.category.toLowerCase()}:</span>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              {feedback.description}
            </div>
          </div>

          {/* Respuesta (si existe) */}
          {feedback.response?.text && (
            <div>
              <span className="font-semibold text-[#17243D]">Respuesta:</span>
              <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-gray-700">
                <p className="text-gray-800">{feedback.response.text}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <span>Respondido por: </span>
                  <span className="font-medium">{feedback.response.respondedBy}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(feedback.response.responseDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#17243D] text-white rounded-lg hover:bg-[#EF3340] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Componente de Tabla de Mis Feedbacks (sin cambios)
const TablaMisFeedbacks = ({ data, headers, onViewDetails, paginaActual = 1, itemsPorPagina = 10 }) => {
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const dataPagina = Array.isArray(data) ? data.slice(inicio, fin) : [];

  // Función para truncar texto largo
  const truncarTexto = (texto, maxLength = 60) => {
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
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    f.category === 'Queja' 
                      ? 'bg-blue-100 text-[#17243D]' 
                      : 'bg-blue-100 text-[#17243D]'
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
                      <MdPending className="text-yellow-400 text-lg" />
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
                    <MdInfo
                      title="Ver detalles"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onViewDetails(f)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-8 text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <MdInfo className="h-12 w-12 mb-2" />
                  <p className="text-lg">No tienes quejas o sugerencias que mostrar</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// 🔹 Componente de Paginación (sin cambios)
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
export default StudentFeedbacks;