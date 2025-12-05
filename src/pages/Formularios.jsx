import { useState, useEffect } from "react";


const FORMULARIOS_KEY = "formulariosCache";
const ITEMS_POR_PAGE = 10;

const Paginacion = ({ totalItems, itemsPerPage, paginaActual, setPaginaActual }) => {
  const totalPaginas = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const maxButtons = Math.min(totalPaginas, 5);
  const botones = Array.from({ length: maxButtons }, (_, i) => i + 1);

  const handlePrev = () => { if (paginaActual > 1) setPaginaActual(paginaActual - 1); };
  const handleNext = () => { if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1); };

  return (
    <div className="flex justify-center gap-1 md:gap-3 mt-4 mb-10 flex-wrap" >
      <button
        onClick={handlePrev}
        disabled={paginaActual === 1}
        className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center transition-all text-xs md:text-base ${
          paginaActual === 1
            ? "bg-white border border-gray-200 text-gray-300 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-500 hover:bg-[#20B2AA] hover:text-white"
        }`}
      >
        &lt;
      </button>

      {botones.map(num => (
        <button
          key={num}
          onClick={() => setPaginaActual(num)}
          className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-medium text-xs md:text-sm transition-all ${
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
        className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center transition-all text-xs md:text-base ${
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

const Formularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);

  const queryParams = new URLSearchParams(window.location.search);
  const estudianteActual = queryParams.get("estudiante");

  const fetchFormularios = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_N8N_BACKEND_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return;

      const data = await res.json();
      const rawFormularios = Array.isArray(data) ? data.map(item => item.json || item) : [];

      const filtradosPorEstudiante = estudianteActual
        ? rawFormularios.filter(f => f.nombre.toLowerCase() === estudianteActual.toLowerCase())
        : rawFormularios;

      localStorage.setItem(FORMULARIOS_KEY, JSON.stringify(filtradosPorEstudiante));
      setFormularios(filtradosPorEstudiante);
    } catch (error) {
      console.error(error);
    }
  };

  const parseFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const [fecha, hora] = fechaStr.split(" ");
    if (!fecha || !hora) return fechaStr;
    const [h, m] = hora.split(":");
    const isoString = `${fecha}T${h.padStart(2, "0")}:${m.padEnd(2, "0")}:00`;
    const dateObj = new Date(isoString);
    return isNaN(dateObj) ? fechaStr : dateObj.toLocaleString();
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  const estadosDisponibles = ["Pendiente", "En revisión", "Aprobado"];
  const formulariosFiltrados =
    filtro === "Todos"
      ? formularios
      : formularios.filter(f => f.estado === filtro);

  const indexUltimo = paginaActual * ITEMS_POR_PAGE;
  const indexPrimero = indexUltimo - ITEMS_POR_PAGE;
  const formulariosActuales = formulariosFiltrados.slice(indexPrimero, indexUltimo);

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
    <div className="w-full flex flex-col bg-white" style={{ fontFamily: "Gowun Batang, serif" }}>
        <div className="px-4 md:px-6 py-6 md:py-10">
        <h1 className="font-black text-2xl md:text-4xl text-[#17243D]">Formularios</h1>
        <hr className="my-4 border-t-2 border-[#17243D]" />
        <p className="text-xs md:text-base text-[#17243D]">
          Este módulo permite gestionar formularios (Prácticas pre-profesionales y Vinculación) y enviar recordatorios automáticos.
        </p>
      </div>

      {/* 📋 Card Instrucciones - A la izquierda */}
      <div className="mx-auto mb-3 md:mb-6 max-w-xs md:max-w-lg w-full md:mx-10">
        <div
          className="bg-[#A1D5D3] rounded-lg shadow-lg py-1.5 px-2 md:py-2 md:px-3 flex flex-col items-center"
          style={{ fontFamily: "Gowun Batang, serif" }}
        >
          <h3 className="text-xs md:text-lg font-bold md:font-medium text-[#17243D] mb-1 md:mb-2 text-center">Información Importante</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 w-full">
            {/* Fechas a la Izquierda */}
            <div className="space-y-0.5 md:space-y-2">
              <div className="border-l-2 md:border-l-4 border-[#17243D] pl-1.5 md:pl-3">
                <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0 md:mb-1">📅 Solicitar tutor:</p>
                <p className="text-[10px] md:text-sm font-bold md:font-medium text-[#17243D]">Por determinar</p>
              </div>

              <div className="border-l-2 md:border-l-4 border-[#17243D] pl-1.5 md:pl-3">
                <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0 md:mb-1">📤 Enviar comisión:</p>
                <p className="text-[10px] md:text-sm font-bold md:font-medium text-[#17243D]">Por determinar</p>
              </div>
            </div>

            {/* Enlaces a la Derecha */}
            <div className="max-w-full md:max-w-xs">
              <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0.5 md:mb-2">🔗 Enlaces ESFOT:</p>
              <div className="space-y-0 md:space-y-1 text-[9px] md:text-sm">
                {[
                  {
                    label: "Prácticas Pre Profesionales",
                    url: "https://esfot.epn.edu.ec/index.php/practicaas",
                  },
                  {
                    label: "Convalidación",
                    url: "https://esfot.epn.edu.ec/index.php/convalidacioon",
                  },
                  {
                    label: "Guía para el estudiante",
                    url: "https://esfot.epn.edu.ec/index.php/esfot/742-guia-para-el-estudiante-2025-a",
                  },
                  {
                    label: "Calendario Académico",
                    url: "https://esfot.epn.edu.ec/index.php/esfot/752-calendario-2025-a",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#17243D] font-medium hover:text-blue-700 hover:underline transition-colors"
                    >
                      → {item.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-6 mb-6 flex-wrap justify-center p-0 px-2 md:px-0">
        {estadosDisponibles.map(estado => (
          <div
            key={estado}
            onClick={() => { setFiltro(estado); setPaginaActual(1); }}
            className={`px-3 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
              filtro === estado
                ? "bg-[#17243D] text-white"
                : "bg-gray-200 text-[#17243D] hover:bg-[#EF3340] hover:text-white"
            }`}
          >
            <span>{estado}</span>
          </div>
        ))}
      </div>
      <hr className="my-1 mx-6 border-t-2 border-[#dee2e6]" />

      <main className="p-2 md:p-4 flex flex-col gap-2 md:gap-6 items-center">
        <div className="relative shadow-lg bg-[#dee2e6] mb-4 w-full overflow-x-auto md:overflow-visible block">
          <table className="min-w-[600px] md:min-w-0 w-full table-auto text-sm" style={{ fontFamily: "Gowun Batang, serif" }}>
<thead className="sticky top-0 bg-[#17243D] text-white text-xs z-10">
  <tr>
    <th className="p-3 text-center">N°</th>
    <th className="p-3 text-center">Estudiante</th>
    <th className="p-3 text-center">Email</th>
    <th className="p-3 text-center">Tipo de documento</th>
    <th className="p-3 text-center">Tutor asignado</th>
    <th className="p-3 text-center">Estado</th>
  </tr>
</thead>
<tbody>
  {formulariosActuales.length > 0 ? (
    formulariosActuales.map((f, idx) => (
      <tr
        key={f._id || idx}
        className="bg-[#dee2e6] text-[#17243D] hover:bg-[#d1d5dc] hover:text-black text-center transition-all"
      >
        <td className="py-2">{idx + 1}</td>
        <td className="py-2">{f.nombre}</td>
        <td className="py-2">{f.email}</td>
        <td className="py-2">{f.documento}</td>
        <td className="py-2">{f.tutor || "-"}</td>
        <td className={`py-2 font-semibold ${
          f.estado === "Aprobado"
            ? "text-green-600"
            : f.estado === "Pendiente"
            ? "text-yellow-600"
            : "text-gray-600"
        }`}>{f.estado}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center py-4 text-gray-400">
        No hay registros
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        <Paginacion
          totalItems={formulariosFiltrados.length}
          itemsPerPage={ITEMS_POR_PAGE}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
        />
      </main>
    </div>
  );
};


// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default Formularios;
