import React, { useState, useEffect } from "react";
import { PaperClipIcon, UsersIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import usuarioSinfoto from "../../assets/usuarioSinfoto.jpg";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth";

const tiposMensajes = ["Administrativas", "Académicas", "Extracurriculares"];

// Función para limpiar formato markdown/WhatsApp
const limpiarFormato = (texto) => {
  if (!texto) return "";
  return texto
    .replace(/[\*_~`]+/g, "") // elimina *, _, ~, `
    .replace(/\s*•\s*/g, " • ") // deja bullets con espacio
    .replace(/\s*[-]+\s*/g, " ") // elimina guiones sueltos
    .replace(/\s{2,}/g, " ") // colapsa espacios múltiples
    .replace(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g, (match) => match); // deja links como texto
};

const Sidebar = ({
  onSelectMessage,
  nuevoMensaje,
  refresh,
  sidebarOpen,
  onMessageDeleted,
  selectedMessageId,
}) => {
  const { token } = storeAuth();
  const [search, setSearch] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({
    Hoy: true,
    Ayer: true,
    "Esta semana": true,
    Anteriores: true,
  });
  const [tipo, setTipo] = useState("");

  const fetchMensajes = async (tipoFiltro = "") => {
    try {
      const url = tipoFiltro
        ? `${import.meta.env.VITE_BACKEND_URL}/listarmensajes?tipo=${tipoFiltro}`
        : `${import.meta.env.VITE_BACKEND_URL}/listarmensajes`;
      console.log("Fetching mensajes desde:", url);
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Mensajes recibidos:", data);
      setMensajes(data);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
    }
  };

  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este mensaje?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensajes((prev) => prev.filter((msg) => msg._id !== id));
      toast.success("Mensaje eliminado exitosamente");

      if (onMessageDeleted) {
        onMessageDeleted(id);
      }
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
      toast.error("Error al eliminar el mensaje");
    }
  };

  // 🔹 Cargar mensajes al montar el componente
  useEffect(() => {
    fetchMensajes(tipo);
  }, []);

  // 🔹 Si llega un nuevo mensaje desde el padre, agregarlo al inicio
  useEffect(() => {
    if (nuevoMensaje) {
      setMensajes((prev) => [nuevoMensaje, ...prev]);
    }
  }, [nuevoMensaje]);

  // 🔹 Refrescar cuando se elimina un mensaje
  useEffect(() => {
    fetchMensajes(tipo);
  }, [refresh]);

  useEffect(() => {
    fetchMensajes(tipo);
  }, [tipo]);

  // 🔹 Escuchar evento personalizado para recargar historial
  useEffect(() => {
    const handleNuevoMensaje = () => {
      fetchMensajes(tipo);
    };

    window.addEventListener("mensaje-enviado", handleNuevoMensaje);
    return () => {
      window.removeEventListener("mensaje-enviado", handleNuevoMensaje);
    };
  }, [tipo]);

  const filteredHistory = mensajes.filter((item) =>
    item.numbers.some((num) => num.includes(search))
  );

  const groupByTime = (messages) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const groups = { Hoy: [], Ayer: [], "Esta semana": [], Anteriores: [] };

    messages.forEach((msg) => {
      const msgDate = new Date(msg.date);
      const msgDay = new Date(
        msgDate.getFullYear(),
        msgDate.getMonth(),
        msgDate.getDate()
      );

      const diffDays = Math.floor((today - msgDay) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) groups.Hoy.push(msg);
      else if (diffDays === 1) groups.Ayer.push(msg);
      else if (diffDays <= 7) groups["Esta semana"].push(msg);
      else groups.Anteriores.push(msg);
    });

    return groups;
  };

  const groupedMessages = groupByTime(filteredHistory);
  const flattenedMessages = Object.values(groupedMessages).flat();

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#f2f2f2] font-sans" style={inputStyle}>
      {/* Búsqueda y filtros - Se muestran solo cuando sidebar está abierto */}
      {sidebarOpen && (
        <div className="sticky top-0 z-10 px-3 py-3 bg-white border-b border-gray-300 flex flex-col gap-2">
          {/* Búsqueda */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar por número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-md bg-gray-100 text-sm placeholder-gray-400 text-[#17243D] focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition shadow-sm"
            />

            {/* Icono de búsqueda */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </div>

            {/* Botón de limpiar */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-[#17243D] shadow-md hover:shadow-lg transition-all duration-200"
                title="Limpiar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {/* Filtros por tipo */}
          <div className="flex gap-1 px-0">
            {["Todos", "Administrativas", "Académicas", "Extracurriculares"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t === "Todos" ? "" : t)}
                  className={`relative flex-1 text-center px-1.5 py-1.5 text-xs font-medium tracking-tight transition-colors duration-200 whitespace-nowrap first:pl-0
                    ${tipo === (t === "Todos" ? "" : t)
                      ? "text-[#EF3340] font-semibold"
                      : "text-[#17243D] hover:text-[#EF3340]"
                    }`}
                >
                  {t}
                  {tipo === (t === "Todos" ? "" : t) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EF3340] rounded-full transition-all"></span>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Lista de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto py-2 px-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {sidebarOpen ? (
          Object.keys(groupedMessages).some((g) => groupedMessages[g].length > 0) ? (
            Object.keys(groupedMessages).map(
              (group) =>
                groupedMessages[group].length > 0 && (
                  <div key={group} className="mb-2">
                    <div
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-200 rounded-md transition"
                      onClick={() => toggleGroup(group)}
                    >
                      <span className="text-gray-600 text-xs font-semibold uppercase">
                        {group}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-600 transform transition-transform ${
                          expandedGroups[group] ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    {expandedGroups[group] &&
                      groupedMessages[group].map((msg) => {
                        const isSelected = selectedMessageId === msg._id;
                        return (
                          <div
                            key={msg._id}
                            onClick={() => onSelectMessage(msg)}
                            className={`flex items-start gap-3 px-3 py-2 mb-1 rounded-md cursor-pointer transition-colors duration-200 ease-in-out shadow-sm hover:bg-gray-300 ${
                              isSelected ? "bg-gray-300" : "bg-white"
                            }`}
                          >
                          <div className="w-10 h-10 rounded-full overflow-hidden shadow mt-1 border border-gray-300">
                            <img
                              src={usuarioSinfoto}
                              alt="usuario"
                              className="w-10 h-10 rounded-full"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[#17243D] truncate">
                                {msg.originalMessage
                                  ? limpiarFormato(msg.originalMessage)
                                      .split(" ")
                                      .slice(0, 5)
                                      .join(" ") + "..."
                                  : limpiarFormato(msg.message)
                                      .split(" ")
                                      .slice(0, 5)
                                      .join(" ") + "..."}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(msg.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <button
                                  onClick={(e) => handleDeleteMessage(msg._id, e)}
                                  className="p-1 text-[#A1D5D3] hover:text-[#20B2AA] transition-colors"
                                  title="Eliminar mensaje"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {msg.originalMessage
                                ? limpiarFormato(msg.originalMessage)
                                : limpiarFormato(msg.message)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <UsersIcon className="w-3 h-3" />
                                {msg.numbers.length}
                              </span>
                              {msg.files?.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <PaperClipIcon className="w-3 h-3" />
                                  {msg.files.length}
                                </span>
                              )}
                            </div>
                          </div>
                          </div>
                        );
                      })}
                  </div>
                )
            )
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">
              No hay mensajes
            </div>
          )
        ) : (
          // Vista colapsada - cada punto representa una conversación
          <div className="flex flex-col items-center gap-2 px-1 py-2">
            {flattenedMessages.map((msg) => {
              const isSelected = selectedMessageId === msg._id;
              return (
                <div
                  key={msg._id}
                  onClick={() => onSelectMessage(msg)}
                  className={`w-full flex justify-center cursor-pointer py-1.5 rounded-md transition ${
                    isSelected ? "bg-gray-300" : "hover:bg-gray-200"
                  }`}
                  title={
                    msg.originalMessage
                      ? limpiarFormato(msg.originalMessage)
                      : limpiarFormato(msg.message)
                  }
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#17243D]" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = { fontFamily: "Gowun Batang, serif" };
export default Sidebar;

