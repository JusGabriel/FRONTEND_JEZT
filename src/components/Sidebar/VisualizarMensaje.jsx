import React from "react";
import {
  PaperClipIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const VisualizarMensaje = ({ mensaje }) => {
  if (!mensaje) return null;

  // Permite mostrar saltos de línea del texto real
  const formatearTexto = (texto) =>
    texto
      .split("\n")
      .map((linea, i) => (
        <p key={i} className="mb-2 text-gray-200 leading-relaxed">
          {linea.trim()}
        </p>
      ));

  // Quita TODO formato markdown/WhatsApp y muestra solo texto plano
  const limpiarFormato = (texto) => {
    if (!texto) return "";
    // Quita *, _, ~, `, y también elimina los guiones bajos y asteriscos sueltos
    return texto
      .replace(/[\*_~`]+/g, "") // elimina *, _, ~, `
      .replace(/\s*•\s*/g, " • ") // deja bullets con espacio
      .replace(/\s*[-]+\s*/g, " ") // elimina guiones sueltos
      .replace(/\s{2,}/g, " ") // colapsa espacios múltiples
      .replace(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g, (match) => match); // deja links como texto
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f2] text-[#17243D] p-6 font-sans">
      {/* Header superior */}
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-lg font-bold text-[#17243D] flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-[#EF3340]" />
          Mensaje seleccionado
        </h2>
      </div>

      {/* Contenedor del mensaje */}
      <div className="bg-white rounded-xl p-5 flex-1 overflow-y-auto shadow-lg">
        {/* Encabezado tipo correo */}
        <div className="border-b border-gray-200 pb-3 mb-4 text-sm">
          <div className="mb-1">
            <strong className="text-gray-600">De:</strong>{" "}
            <span className="text-[#17243D] font-medium">
              {mensaje.sender || "Remitente desconocido"}
            </span>
          </div>
          <div className="mb-1">
            <strong className="text-gray-600">Para:</strong>{" "}
            {mensaje.numbers?.length > 0
              ? mensaje.numbers.join(", ")
              : "Sin destinatarios"}
          </div>
          {mensaje.asunto && (
            <div className="mb-1">
              <strong className="text-gray-600">Asunto:</strong>{" "}
              <span className="font-medium">{mensaje.asunto}</span>
            </div>
          )}
          <div className="text-gray-500 text-xs">
            {new Date(mensaje.date).toLocaleString("es-EC", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </div>
        </div>

        {/* Adjuntos */}
        {mensaje.files?.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <PaperClipIcon className="w-4 h-4" />
              Adjuntos:
            </div>
            <div className="flex flex-wrap gap-2">
              {mensaje.files.map((f, i) => {
                const tipo = f.mimeType || "";
                const extension =
                  tipo.includes("pdf")
                    ? "PDF"
                    : tipo.includes("word")
                    ? "DOCX"
                    : tipo.includes("image")
                    ? "IMG"
                    : "FILE";
                const color =
                  extension === "PDF"
                    ? "bg-red-600"
                    : extension === "DOCX"
                    ? "bg-blue-600"
                    : extension === "IMG"
                    ? "bg-green-600"
                    : "bg-gray-400";

                return (
                  <a
                    key={i}
                    href={f.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded-md text-xs font-medium ${color} hover:opacity-90 transition-all duration-200 border border-gray-300 flex items-center gap-1 shadow-sm hover:shadow-md`}
                  >
                    📎 {f.fileName}{" "}
                    <span className="opacity-70 text-[10px]">{extension}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Cuerpo del mensaje */}
        <div className="bg-[#17243D] rounded-lg p-5 border border-gray-200 leading-relaxed text-[15px]">
          {mensaje.originalMessage
            ? formatearTexto(limpiarFormato(mensaje.originalMessage))
            : mensaje.message
            ? formatearTexto(limpiarFormato(mensaje.message))
            : "Sin contenido disponible."}
        </div>
      </div>

    </div>
  );
};

export default VisualizarMensaje;

