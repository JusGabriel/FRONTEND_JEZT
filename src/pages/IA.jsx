import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import storeAuth from '../context/storeAuth';
import { FaSearch, FaEllipsisV, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import storeProfile from "../context/storeProfile";
import TextareaAutosize from "react-textarea-autosize";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

const IA = () => {
  const { user } = storeProfile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  
  // Estados para calificación
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentResponseId, setCurrentResponseId] = useState(null);
  
  const chatRef = useRef(null);
  //  NO obtener token aquí - hacerlo en cada petición
  
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL; //  URL del backend Python

  // === Cargar historial de conversaciones ===
  const obtenerHistorial = async () => {
    try {
      const token = storeAuth.getState().token || ""; //  Obtener token dinámicamente
      const res = await axios.get(`${API_URL}/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const historial = res.data || [];
      setChats(historial);
      
      if (historial.length > 0 && !selectedChat) {
        setSelectedChat(historial[0]);
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  // === Cargar mensajes cuando cambia la conversación seleccionada ===
  useEffect(() => {
    if (selectedChat) {
      const mensajesReconstruidos = [];
      
      // Solo reconstruir si NO hay mensajes en el estado local
      // (para cuando recargamos la página y cargamos un chat anterior)
      if (selectedChat.preguntas && selectedChat.respuestas && messages.length === 0) {
        const maxLength = Math.max(selectedChat.preguntas.length, selectedChat.respuestas.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (selectedChat.preguntas[i]) {
            mensajesReconstruidos.push({ 
              sender: "user", 
              text: selectedChat.preguntas[i] 
            });
          }
          if (selectedChat.respuestas[i]) {
            mensajesReconstruidos.push({ 
              sender: "bot", 
              text: selectedChat.respuestas[i] 
            });
          }
        }
        
        if (mensajesReconstruidos.length > 0) {
          setMessages(mensajesReconstruidos);
        }
      } else if (!selectedChat.preguntas && !selectedChat.respuestas && messages.length === 0) {
        // Fallback para chats antiguos con estructura simple
        const tempMsgs = [];
        if (selectedChat.pregunta) {
          tempMsgs.push({ sender: "user", text: selectedChat.pregunta });
        }
        if (selectedChat.respuesta) {
          tempMsgs.push({ sender: "bot", text: selectedChat.respuesta });
        }
        if (tempMsgs.length > 0) {
          setMessages(tempMsgs);
        }
      }
    } else {
      setMessages([]);
    }
  }, [selectedChat?._id]);

  // === Scroll automático al final ===
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingMessage]);

  // === Crear nueva conversación ===
  const crearConversacion = async () => {
    try {
      const token = storeAuth.getState().token || ""; //  Obtener token dinámicamente
      const res = await axios.post(
        `${API_URL}/crear`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.data.ok) {
        const nuevaConversacion = {
          _id: res.data.id,
          pregunta: "",
          respuesta: "",
          preguntas: [],
          respuestas: [],
          fecha: new Date()
        };
        
        setSelectedChat(nuevaConversacion);
        setMessages([]);
        setChats((prev) => [nuevaConversacion, ...prev]);
        setInput("");
        
        return nuevaConversacion;
      }
    } catch (err) {
      console.error("Error al crear conversación:", err);
    }
    return null;
  };

  // === NUEVO: Enviar mensaje con STREAMING ===
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Crear chat si no existe
    if (chats.length === 0) {
      const nuevaConversacion = await crearConversacion();
      if (nuevaConversacion) {
        await enviarMensajeStreaming(input, nuevaConversacion._id);
      }
      return;
    }

    if (!selectedChat) {
      const nuevaConversacion = await crearConversacion();
      if (nuevaConversacion) {
        await enviarMensajeStreaming(input, nuevaConversacion._id);
      }
      return;
    }

    await enviarMensajeStreaming(input, selectedChat._id);
  };

  // === NUEVO: Función con STREAMING ===
  const enviarMensajeStreaming = async (texto, chatId) => {
    if (!chatId) {
      console.error(" No hay ID de chat para enviar mensaje");
      return;
    }

    // Agregar mensaje de usuario inmediatamente
    const userMessage = { sender: "user", text: texto };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      //  OBTENER TOKEN DINÁMICAMENTE EN CADA PETICIÓN
      const token = storeAuth.getState().token || "";
      
      if (!token) {
        console.error(" No hay token disponible");
        throw new Error("Usuario no autenticado");
      }
      
      
      //  LLAMAR AL BACKEND NODE.JS (NO directamente a Python)
      // El Backend Node.js se encargará de reenviar al microservicio Python
      const response = await fetch(`${API_URL}/enviar/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  //  Token incluido SIEMPRE
        },
        body: JSON.stringify({
          question: texto
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let respuestaCompleta = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              // PROCESAR STREAMING
              if (parsed.etapa === 'completado') {
                // Respuesta final recibida
                respuestaCompleta = parsed.respuesta;
                
                const botMessage = {
                  sender: "bot",
                  text: respuestaCompleta,
                  id_respuesta_python: parsed.id_respuesta_python,
                  calificacion_actual: parsed.calificacion_actual,
                  necesita_calificacion: parsed.necesita_calificacion
                };
                
                // ✅ SOLO agregar el mensaje a la vista
                // NO actualizar selectedChat aquí (causa duplicados)
                setMessages(prev => [...prev, botMessage]);
                setStreamingMessage("");
                
              } else if (parsed.etapa && parsed.etapa !== 'completado') {
                // Mostrar progreso
                setStreamingMessage(parsed.mensaje);
              }
            } catch (e) {
              console.log('Chunk no JSON:', data);
            }
          }
        }
      }

    } catch (err) {
      console.error(" Error en streaming:", err);
      
      const errorMessage = {
        sender: "bot",
        text: " Error al obtener respuesta. Por favor intenta nuevamente.",
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage("");
      
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  // === Eliminar conversación ===
  const eliminarConversacion = async (id, e) => {
    if (e) e.stopPropagation();
    
    if (window.confirm("¿Estás seguro de que quieres eliminar esta conversación?")) {
      try {
        const token = storeAuth.getState().token || ""; //  Obtener token dinámicamente
        await axios.delete(`${API_URL}/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chatsActualizados = chats.filter((c) => c._id !== id);
        setChats(chatsActualizados);
        
        if (selectedChat?._id === id) {
          if (chatsActualizados.length > 0) {
            setSelectedChat(chatsActualizados[0]);
          } else {
            setSelectedChat(null);
            setMessages([]);
          }
        }
      } catch (err) {
        toast.error("No se pudo eliminar la conversación.");
      }
    }
  };

  // Abrir modal de calificación
  const abrirCalificacion = (responseId, calificacionActual = 0) => {
    setCurrentResponseId(responseId);
    setCurrentRating(calificacionActual);
    setShowRatingModal(true);
  };

  // Calificar respuesta
  const calificarRespuesta = async (calificacion) => {
    if (!currentResponseId) return;

    try {
      const token = storeAuth.getState().token || ""; //  Obtener token dinámicamente
      const res = await axios.post(
        `${API_URL}/calificar`,
        {
          id_respuesta_python: currentResponseId,
          calificacion: calificacion,
          conversacion_id: selectedChat?._id  // ENVIAR ID DE CONVERSACIÓN
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.ok) {
        //  MOSTRAR MENSAJE ESPECÍFICO SI FUE ENVIADO A CORRECCIÓN
        if (res.data.enviado_a_correccion) {
          alert( "Esta pregunta será revisada por un pasante.");
        } else {
          alert(res.data.message);
        }
        
        setShowRatingModal(false);
        setCurrentRating(0);
        setCurrentResponseId(null);
        
        // Actualizar la calificación en los mensajes
        setMessages(prev => prev.map(msg => 
          msg.id_respuesta_python === currentResponseId 
            ? { ...msg, calificacion_actual: calificacion } 
            : msg
        ));
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error("Error al calificar:", err);
      alert("Error al enviar calificación");
    }
  };

  // Filtrar chats
  const filteredChats = chats.filter((c) => {
    const searchTerm = search.toLowerCase();
    return (
      c.pregunta?.toLowerCase().includes(searchTerm) ||
      c.preguntas?.some(p => p.toLowerCase().includes(searchTerm)) ||
      (c.preguntas?.length === 0 && "nueva conversación".includes(searchTerm))
    );
  });

  //  Obtener título para mostrar en sidebar
  const obtenerTituloChat = (chat) => {
    if (chat.preguntas && chat.preguntas.length > 0) {
      return chat.preguntas[0].substring(0, 50) + (chat.preguntas[0].length > 50 ? "..." : "");
    }
    return chat.pregunta || "Nueva conversación";
  };



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
    <div className="flex w-full h-full bg-gray-950 text-gray-100" style={{ fontFamily: "Gowun Batang, serif" }}>
      {/*  SIDEBAR */}
      <div className={`${sidebarOpen ? "w-80" : "w-12 sm:w-20"} flex flex-col border-r border-gray-300 bg-[#f2f2f2] shadow-sm transition-all duration-300`}>

        {/* Header con título, buscador y toggle */}
        <div className={`relative flex flex-col p-3 border-b border-gray-800 text-white transition-all duration-300
            ${sidebarOpen ? 'bg-[#17243D] min-h-[80px]' : 'bg-transparent min-h-[60px]'}`}>

          <div className="relative flex items-center w-full">
            {sidebarOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 font-semibold text-white text-center text-lg">
                Chats
              </span>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`transition-colors ${sidebarOpen ? 'ml-auto text-gray-300 hover:text-white' : 'mx-auto text-[#17243D] hover:text-[#20B2AA]'}`}
            >
              {sidebarOpen ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
            </button>
          </div>

          {sidebarOpen && (
            <div className="relative w-full mt-3 px-3">
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-sm placeholder-gray-400 text-[#17243D] focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition shadow-sm"
              />
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
            </div>
          )}
        </div>

        {/* Botón nuevo chat */}
        <button
          className={`mx-3 py-2 mt-3 rounded-lg transition-colors flex items-center justify-center ${
            sidebarOpen
              ? "bg-[#17243D] hover:bg-[#EF3340] text-sm text-white"
              : "bg-[#17243D] hover:bg-[#EF3340] text-white"
          }`}
          onClick={crearConversacion}
          title={sidebarOpen ? "" : "Nuevo chat"}
        >
          {sidebarOpen ? (
            "Nuevo chat"
          ) : (
            <FaPlus className="text-white" size={14} />
          )}
        </button>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto mt-3 px-2">
          {filteredChats.length === 0 && sidebarOpen ? (
            <p className="text-center text-gray-500 text-sm mt-6">
              No hay conversaciones
            </p>
          ) : (
            filteredChats.map((c) => (
              <div
                key={c._id}
                onClick={() => setSelectedChat(c)}
                className={`cursor-pointer p-2 rounded-md mb-2 py-2 hover:bg-gray-300 transition-colors ease-in-out shadow-sm group relative ${
                  selectedChat?._id === c._id ? "bg-gray-300" : ""
                }`}
              >
                {sidebarOpen ? (
                  <>
                    <p className="truncate text-sm text-[#17243D] font-semibold pr-6">
                      {obtenerTituloChat(c)}
                    </p>
                    <div className="text-xs text-[#000000] mt-1">
                      {c.preguntas?.length || (c.pregunta ? 1 : 0)} mensaje
                      {c.preguntas?.length !== 1 ? 's' : ''}
                    </div>
                    <button
                      onClick={(e) => eliminarConversacion(c._id, e)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-[#A1D5D3] hover:text-[#20B2AA] p-1"
                      title="Eliminar conversación"
                    >
                      <FaTrash size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedChat?._id === c._id ? "bg-[#17243D]" : "bg-gray-500"
                    }`}></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 💬 CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white text-[#17243D]">
        {/* Contenedor de mensajes */}
        <div
          ref={chatRef}
          className={`flex-1 overflow-y-auto px-6 py-4 transition-all duration-300 ${
            messages.length === 0 && (!selectedChat || !selectedChat.pregunta)
              ? "flex flex-col items-center justify-center"
              : ""
          }`}
        >
          {/* CASO: No hay mensajes (chat vacío) */}
          {messages.length === 0 && (!selectedChat || !selectedChat.pregunta) && (
            <>
              <img src="/logo.png" alt="Logo" className="w-16 h-16 opacity-70" />
              <h2 className="text-xl mt-4 font-light text-[#17243D]">
                ¿En qué puedo ayudarte?
              </h2>
              <p className="text-[#17243D] text-center mt-2 max-w-md">
                {chats.length === 0 
                  ? "Escribe tu primera pregunta para comenzar una conversación" 
                  : "Selecciona una conversación o escribe un mensaje para comenzar"}
              </p>
            </>
          )}

          {/* CASO: Hay mensajes */}
          {messages.length > 0 && (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className="my-4">
                  {msg.sender === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-[#A1D5D3] text-[#17243D] px-4 py-2 rounded-2xl max-w-xl break-words whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div
                        className="bg-[#F3F4F6] text-[#17243D] px-4 py-2 rounded-2xl max-w-2xl"
                        style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
                      >
                        {msg.text}
                        {/* MOSTRAR BOTÓN DE CALIFICACIÓN DENTRO DEL MISMO DIV */}
                        {msg.necesita_calificacion && msg.id_respuesta_python && (
                          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-2">
                            <span className="text-xs text-gray-600">¿Te ayudó esta respuesta?</span>
                            <button
                              onClick={() => abrirCalificacion(msg.id_respuesta_python, msg.calificacion_actual || 0)}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                            >
                              {msg.calificacion_actual > 0 ? `Calificada: ⭐${msg.calificacion_actual}` : 'Calificar'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* NUEVO: Mensaje de streaming en tiempo real */}
              {isLoading && streamingMessage && (
                <div className="flex justify-start my-4">
                  <div className="bg-[#F3F4F6] text-[#17243D] px-4 py-2 rounded-2xl max-w-md">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-[#17243D]">{streamingMessage}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de carga estándar */}
              {isLoading && !streamingMessage && (
                <div className="flex justify-start my-4">
                  <div className="bg-[#F3F4F6] text-[#17243D] px-4 py-2 rounded-2xl max-w-md">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#17243D] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-[#17243D]">Procesando tu pregunta...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input siempre visible cuando hay chat seleccionado o no hay chats */}
        {(selectedChat || chats.length === 0) && (
          <div className="border-t border-gray-300 p-3 bg-white">
            <div className="flex items-end bg-[#F3F4F6] rounded-lg p-2 gap-2">
              
              <TextareaAutosize
                minRows={1}
                maxRows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={
                  chats.length === 0
                    ? "Escribe tu primera pregunta..."
                    : "Escribe tu mensaje..."
                }
                className="flex-1 px-3 py-2 rounded-md bg-white text-[#17243D] placeholder-gray-500 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition-all resize-none"
              />

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-md border border-white text-white bg-[#17243D] hover:bg-[#1E3A5F] hover:text-[#20B2AA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Enviar mensaje"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                ) : (
                  <FiSend className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* MODAL DE CALIFICACIÓN */}
      {showRatingModal && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-[#17243D] mb-4">Califica esta respuesta</h3>
            <p className="text-gray-600 mb-6">Tu opinión nos ayuda a mejorar el chatbot</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setCurrentRating(star)}
                  className="transition-all transform hover:scale-110"
                >
                  <FaStar
                    size={40}
                    className={`${
                      star <= currentRating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setCurrentRating(0);
                  setCurrentResponseId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => currentRating > 0 && calificarRespuesta(currentRating)}
                disabled={currentRating === 0}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default IA;

