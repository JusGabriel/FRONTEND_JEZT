import { useState, useEffect } from "react";

// Componente profesional para mostrar formularios según rol
const FormulariosEstudiante = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Tomamos token desde localStorage (JWT) para autenticación
  const token = localStorage.getItem("auth-token");

  const fetchFormularios = async () => {
    try {
      if (!token) return;

      const res = await fetch(import.meta.env.VITE_N8N_BACKEND_URL_E, {
        method: "GET", // Backend filtra por rol/email
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error en la respuesta del servidor");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Backend devuelve solo los datos permitidos
      setFormularios(Array.isArray(data) ? data : [data]);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los formularios", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Cargando formulario...</p>;
  }

  return (
    <div className="w-full flex flex-col bg-white" style={inputSyle}>
      <div className="px-4 md:px-6 py-8 md:py-13">
        <h1 className="font-black text-2xl md:text-4xl text-[#17243D]">
          Formulario
        </h1>
        <hr className="my-4 border-t-2 border-[#17243D]" />
        <p className="text-xs md:text-base text-[#17243D]">
          Este módulo te permite ver el estado de tu formulario enviado a la
          comisión.
        </p>
      </div>

      {/* Card de información */}
      <div className="mx-auto mb-3 md:mb-10 max-w-xs md:max-w-lg w-full md:mx-5">
        <div
          className="bg-[#A1D5D3] rounded-lg shadow-lg py-1.5 px-2 md:py-2 md:px-3 flex flex-col items-center"
          style={{ fontFamily: "Gowun Batang, serif" }}
        >
          <h3 className="text-xs md:text-lg font-bold md:font-medium text-[#17243D] mb-1 md:mb-2 text-center">
            Información Importante
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 w-full">
            <div className="space-y-0.5 md:space-y-2">
              <div className="border-l-2 md:border-l-4 border-[#17243D] pl-1.5 md:pl-3">
                <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0 md:mb-1">
                  📅 Solicitar tutor:
                </p>
                <p className="text-[10px] md:text-sm font-bold md:font-medium text-[#17243D]">
                  {formularios[0]?.fecha_max_solicitar_tutor || "Por determinar"}
                </p>
              </div>

              <div className="border-l-2 md:border-l-4 border-[#17243D] pl-1.5 md:pl-3">
                <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0 md:mb-1">
                  📤 Enviar comisión:
                </p>
                <p className="text-[10px] md:text-sm font-bold md:font-medium text-[#17243D]">
                  {formularios[0]?.fecha_max_enviar_comision || "Por determinar"}
                </p>
              </div>
            </div>

            <div className="max-w-full md:max-w-xs">
              <p className="text-[10px] md:text-xs font-bold md:font-normal text-[#17243D] mb-0.5 md:mb-2">
                🔗 Enlaces ESFOT:
              </p>
              <div className="space-y-0 md:space-y-1 text-[9px] md:text-sm">
                {[
                  { label: "Prácticas Pre Profesionales", url: "https://esfot.epn.edu.ec/index.php/practicaas" },
                  { label: "Convalidación", url: "https://esfot.epn.edu.ec/index.php/convalidacioon" },
                  { label: "Guía para el estudiante", url: "https://esfot.epn.edu.ec/index.php/esfot/742-guia-para-el-estudiante-2025-a" },
                  { label: "Calendario Académico", url: "https://esfot.epn.edu.ec/index.php/esfot/752-calendario-2025-a" },
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

      {/* Tabla */}
      <div className="px-2 md:px-4 pb-4 flex-1 flex flex-col">
        <div className="relative shadow-lg bg-[#dee2e6] mt-2 mb-10 overflow-x-auto md:overflow-y-auto flex-1">
          <table className="w-full table-auto text-xs md:text-sm" style={{ fontFamily: "Gowun Batang, serif" }}>
            <thead className="sticky top-0 bg-[#17243D] text-white text-xs z-10">
              <tr>
                <th className="p-2 md:p-3 text-center text-xs">N°</th>
                <th className="p-2 md:p-3 text-center text-xs">Tipo Doc</th>
                <th className="p-2 md:p-3 text-center text-xs">Fecha Envío</th>
                <th className="p-2 md:p-3 text-center text-xs">Tutor</th>
                <th className="p-2 md:p-3 text-center text-xs">Estado</th>
              </tr>
            </thead>
            <tbody>
              {formularios.length > 0 ? (
                formularios.map((f, idx) => (
                  <tr key={idx} className="bg-[#dee2e6] text-[#17243D] hover:bg-[#d1d5dc] hover:text-black text-center transition-all">
                    <td className="py-1 md:py-2 px-1 md:px-2 text-xs">{idx + 1}</td>
                    <td className="py-1 md:py-2 px-1 md:px-2 text-xs">{f.documento || "-"}</td>
                    <td className="py-1 md:py-2 px-1 md:px-2 text-xs">
                      {f.fecha_envio ? new Date(f.fecha_envio).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-1 md:py-2 px-1 md:px-2 text-xs">{f.tutor || "-"}</td>
                    <td className={`py-1 md:py-2 px-1 md:px-2 font-semibold text-xs ${
                      f.estado === "Aprobado" ? "text-green-600" :
                      f.estado === "Pendiente" ? "text-yellow-600" : "text-gray-600"
                    }`}>
                      {f.estado || "Pendiente"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No se encontró tu formulario
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default FormulariosEstudiante;
