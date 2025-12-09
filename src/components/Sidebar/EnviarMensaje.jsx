import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router"; 
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import QRCode from "react-qr-code";
import pdfIcon from "../../assets/pdf-icon.png";
import wordIcon from "../../assets/word-icon.png";
import excelIcon from "../../assets/excel-icon.jpg";
import fileIcon from "../../assets/file-icon.png";
import storeAuth from "../../context/storeAuth";



function splitNumbers(text) {
  return text
    .split(/[\s,;\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function htmlToText(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function getFilePreview(file) {
  const type = file.type;
  if (type.startsWith("image/")) return URL.createObjectURL(file);
  if (type === "application/pdf") return pdfIcon;
  if (type.includes("word")) return wordIcon;
  if (type.includes("excel")) return excelIcon;
  return fileIcon;
}


const ALLOWED_TIPOS = ["Administrativas", "Académicas", "Extracurriculares"];


const EnviarMensaje = () => {
  const { token } = storeAuth();
  
  const [message, setMessage] = useState("");
  const [tipo, setTipo] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('whatsappLoggedIn') === 'true';
  });
  const [showQrModal, setShowQrModal] = useState(false);
  const [qr, setQr] = useState();
  const [waState, setWaState] = useState(null);
  const [resultadosCarrera, setResultadosCarrera] = useState({});


  // Handlers
  const addNumbersFromString = (str) => {
    const toAdd = splitNumbers(str);
    setNumbers((prev) => Array.from(new Set([...prev, ...toAdd])));
  };

  const removeNumber = (num) =>
    setNumbers((prev) => prev.filter((n) => n !== num));

  const handleInputKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addNumbersFromString(inputValue);
        setInputValue("");
        setInputHeight(40);
      }
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (text) {
      e.preventDefault();
      addNumbersFromString(text);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    const h = Math.min(140, Math.max(40, inputRef.current.scrollHeight));
    setInputHeight(h);
  }, [inputValue]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);

    // Separar imágenes y documentos
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    const docFiles = newFiles.filter(
      (f) =>
        !f.type.startsWith("image/") &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(f.type)
    );

    // Contar archivos actuales
    const existingImages = files.filter((f) => f.type.startsWith("image/"));
    const existingDocs = files.filter(
      (f) =>
        !f.type.startsWith("image/") &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(f.type)
    );

    if (existingImages.length + imageFiles.length > 3) {
      toast.error("Solo puedes subir hasta 3 imágenes.");
      e.target.value = "";
      return;
    }

    if (existingDocs.length + docFiles.length > 3) {
      toast.error("Solo puedes subir hasta 3 documentos.");
      e.target.value = "";
      return;
    }

    // Agregar archivos válidos
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // reset input
  };


  const handleRemoveFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

    // Cerrar sesión de WhatsApp
  const cerrarSesionWhatsapp = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      setLoggedIn(false);
      localStorage.removeItem('whatsappLoggedIn');
      toast.success("Sesión de WhatsApp cerrada. Debes escanear el QR nuevamente.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error al cerrar sesión de WhatsApp");
    }
  };

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const ready = await verificarStatus();
        if (ready) {
          setLoggedIn(true);
          localStorage.setItem('whatsappLoggedIn', 'true');
          setShowQrModal(false);
        } else {
          setLoggedIn(false);
          localStorage.removeItem('whatsappLoggedIn');
        }
      } catch (error) {
        console.error('Error verificando autenticación inicial:', error);
        setLoggedIn(false);
        localStorage.removeItem('whatsappLoggedIn');
      }
    };

    checkInitialAuth();
  }, []);

  // Polling de estado hasta que esté listo
  useEffect(() => {
    let intervalId;
    if (!loggedIn) {
      intervalId = setInterval(async () => {
        const ready = await verificarStatus();
        if (ready) {
          setLoggedIn(true);
          localStorage.setItem('whatsappLoggedIn', 'true');
          setShowQrModal(false);
          clearInterval(intervalId);
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loggedIn]);

 const obtenerQr = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/qr`,
        { 
          validateStatus: (s) => s < 500, 
          headers: { 
            "Cache-Control": "no-cache",
            Authorization: `Bearer ${token}`
          } 
        }
      );
      if (data?.ready) {
        // 🔹 GUARDAR ESTADO CUANDO ESTÉ LISTO
        setLoggedIn(true);
        localStorage.setItem('whatsappLoggedIn', 'true');
        setShowQrModal(false);
        return null;
      }
      if (data?.qr) return data.qr;
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error al obtener QR");
      return null;
    }
  };

  const verificarStatus = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/status`,
        { 
          headers: { 
            "Cache-Control": "no-cache",
            Authorization: `Bearer ${token}`
          } 
        }
      );
      // Backend ahora retorna { ready: boolean, state: string }
      const isReady = Boolean(data?.ready);
      const stateVal = data?.state || null;
      
      setWaState(stateVal);
      
      // Considerar logueado si ready=true o state=CONNECTED
      const isConnected = (stateVal || '').toUpperCase() === 'CONNECTED';
      const computedReady = isReady || isConnected;
      
      setLoggedIn(computedReady);
      if (computedReady) {
        localStorage.setItem('whatsappLoggedIn', 'true');
        setShowQrModal(false);
      } else {
        localStorage.removeItem('whatsappLoggedIn');
      }
      return computedReady;
    } catch (error) {
      console.error('Error verificando estado:', error);
      setLoggedIn(false);
      localStorage.removeItem('whatsappLoggedIn');
      return false;
    }
  };

const enviarMensajes = async (mensaje, numeros, files, tipo) => {
  if (!mensaje && (!files || files.length === 0)) {
    toast.error("Debes enviar un mensaje o un archivo.");
    return [];
  }
  if (!Array.isArray(numeros) || numeros.length === 0) {
    toast.error("Debes ingresar al menos un número válido.");
    return [];
  }
  if (!tipo || tipo.trim() === "") {
    toast.error("Debes seleccionar una categoría.");
    return [];
  }

  const tipoClean = tipo.trim();
  if (!ALLOWED_TIPOS.includes(tipoClean)) {
    toast.error(
      "El campo 'tipo' debe ser Administrativas, Académicas o Extracurriculares."
    );
    return [];
  }

try {
  // Función para decodificar entidades HTML
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Decodificar mensaje HTML
  let html = mensaje || "";
  html = decodeHtml(html);

  // 1. Capturar links con cualquier combinación de estilos (negrilla, cursiva, tachado)
  let styledLinks = [];
  
  // Expresión para capturar: <b><i>texto</i></b>, <i><b>texto</b></i>, <b>texto</b>, <i>texto</i>, etc.
  // con enlaces dentro de cualquiera de estos
  let tempHtml = html.replace(
    /(<(?:b|strong|i|em|s|del)>)+\s*<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*(<\/(?:b|strong|i|em|s|del)>)+/gi,
    (m, openTags, url, text, closeTags) => {
      // Extraer los estilos de las etiquetas de apertura
      const boldRegex = /<(b|strong)>/gi;
      const italicRegex = /<(i|em)>/gi;
      const strikeRegex = /<(s|del)>/gi;
      
      const isBold = boldRegex.test(openTags);
      const isItalic = italicRegex.test(openTags);
      const isStrike = strikeRegex.test(openTags);
      
      // Construir marcadores
      let prefix = "";
      let suffix = "";
      if (isBold) { prefix = "*" + prefix; suffix = suffix + "*"; }
      if (isItalic) { prefix = "_" + prefix; suffix = suffix + "_"; }
      if (isStrike) { prefix = "~" + prefix; suffix = suffix + "~"; }
      
      const normalize = (s) => s.trim().replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
      const cleanText = text.replace(/<[^>]+>/g, ""); // Limpiar HTML dentro del texto
      
      if (normalize(cleanText) === normalize(url)) {
        return `__STYLED_LINK_URLONLY__${styledLinks.push(`${prefix}${url}${suffix}`) - 1}__`;
      }
      
      styledLinks.push(`${prefix}${cleanText}${suffix}: ${url}`);
      return `__STYLED_LINK_${styledLinks.length - 1}__`;
    }
  );

  // 2. Reemplazar links normales sin estilos
  tempHtml = tempHtml.replace(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (m, url, text) => {
    const normalize = (s) => s.trim().replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    const cleanText = text.replace(/<[^>]+>/g, ""); // Limpiar HTML
    if (normalize(cleanText) === normalize(url)) return url;
    return `${cleanText}: ${url}`;
  });

  // 3. Procesar estilos básicos (negrilla, cursiva, tachado)
  let mensajeWA = tempHtml
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '*$1*')
    .replace(/<b>([\s\S]*?)<\/b>/gi, '*$1*')
    .replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_')
    .replace(/<i>([\s\S]*?)<\/i>/gi, '_$1_')
    .replace(/<s>([\s\S]*?)<\/s>/gi, '~$1~')
    .replace(/<del>([\s\S]*?)<\/del>/gi, '~$1~');

  // Función interna para limpiar el contenido de las listas
  const cleanListContent = (content) => content
    .replace(/<strong>([\s\S]*?)<\/strong>|<b>([\s\S]*?)<\/b>/gi, (m, c1, c2) => `*${c1 || c2}*`)
    .replace(/<em>([\s\S]*?)<\/em>|<i>([\s\S]*?)<\/i>/gi, (m, c1, c2) => `_${c1 || c2}_`)
    .replace(/<s>([\s\S]*?)<\/s>|<del>([\s\S]*?)<\/del>/gi, (m, c1, c2) => `~${c1 || c2}~`)
    // Quitar cualquier etiqueta HTML sobrante dentro del item de lista
    .replace(/<[^>]+>/g, '')
    .trim();

  // Procesar listas ordenadas
  mensajeWA = mensajeWA.replace(/<ol>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    let idx = 1;
    let listItems = inner.replace(/<li>([\s\S]*?)<\/li>/gi, (liMatch, liContent) => {
      return `${idx++}. ${cleanListContent(liContent)}\n`;
    });
    return listItems.trim() + '\n';
  });

  // Procesar listas sin enumerar
  mensajeWA = mensajeWA.replace(/<ul>([\s\S]*?)<\/ul>/gi, (match, inner) => {
    let listItems = inner.replace(/<li>([\s\S]*?)<\/li>/gi, (liMatch, liContent) => {
      return `• ${cleanListContent(liContent)}\n`;
    });
    return listItems.trim() + '\n';
  });

  // 4. Limpieza final de HTML y saltos de línea
  mensajeWA = mensajeWA
    // Asegurar saltos de línea después de párrafos o <br>
    .replace(/<br\s*\/?>(?!\n)/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    // Quitar etiquetas <ul>|<\/ul>|<ol>|<\/ol>|<li> sueltas si las hay
    .replace(/<ul>|<\/ul>|<ol>|<\/ol>|<li>/gi, '')
    .replace(/<\/li>/gi, '\n')
    // Caracteres HTML
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    // Quitar otras etiquetas y limpiar el resultado
    .replace(/<[^>]+>/g, '')
    // Reemplazar múltiples saltos de línea por un máximo de dos
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 5. Restaurar links con estilos
  mensajeWA = mensajeWA
    .replace(/__STYLED_LINK_URLONLY__(\d+)__/g, (m, idx) => styledLinks[Number(idx)])
    .replace(/__STYLED_LINK_(\d+)__/g, (m, idx) => styledLinks[Number(idx)]);

// 🔹 Enviar mensaje
const url = `${import.meta.env.VITE_BACKEND_URL}/send-message`;
const form = new FormData();

form.append("message", mensajeWA);
form.append("tipo", tipoClean);

numeros.forEach((n) => form.append("numbers[]", n));

// Archivos (solo si son File válidos)
if (files && Array.isArray(files)) {
  files.forEach((file) => {
    if (file instanceof File) {
      form.append("files", file);
    }
  });
}

const { data } = await axios.post(url, form, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`
  },
});

toast.success("Mensaje enviado correctamente");
return data?.results || [];
} catch (error) {
  console.error("Error al enviar mensajes:", error);
  toast.error(error?.response?.data?.error || "Error al enviar mensajes");
  return [];
}
};



const handleNumbersSend = async () => {
  if (!numbers.length) {
    toast.error("Agrega al menos un número");
    return;
  }

  setSending(true);

  try {
    const res = await enviarMensajes(message, numbers, files, tipo);

    if (!res || res.length === 0) {
      //  No limpiar campos si hubo error
      return;
    }

    const resultadosFormateados = res.map((r) => ({
      success: r.status === "sent",
      number: r.to?.replace("@c.us", "") || "",
      error: r.error || null,
    }));
    setResults(resultadosFormateados);

    // 🔹 Emitir evento para recargar el historial en Sidebar
    window.dispatchEvent(new CustomEvent("mensaje-enviado"));

    // 🔹 Limpiar campos solo si el mensaje se envió correctamente
    setMessage("");
    setNumbers([]);
    setFiles([]);
    setTipo("");
    setInputValue("");
    setInputHeight(40);
    setResultadosCarrera({}); // <-- deselecciona los checks de carreras

  } catch (error) {
    console.error("Error enviando mensaje:", error);
    toast.error(error?.response?.data?.error || "Error al enviar mensaje");
    //  No limpiar campos en caso de error
  } finally {
    setSending(false);
  }
};





  // 🔹 POLLING QR MODIFICADO
  useEffect(() => {
    if (!showQrModal) return;
    setQr(null);
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      const ready = await verificarStatus();
      if (ready) {
        localStorage.setItem('whatsappLoggedIn', 'true');
        setLoggedIn(true);
        setShowQrModal(false);
        setQr(null);
        stopped = true; // Detener polling inmediatamente
        return;
      }
      // Solo pedir QR si NO está listo
      const q = await obtenerQr();
      if (q) setQr(q);
    };
    tick();
    const id = setInterval(() => {
      if (!stopped) tick();
    }, 10000); // 10 segundos
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [showQrModal]);

   useEffect(() => {
              const link = document.createElement("link");
              link.href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
              link.rel = "stylesheet";
              document.head.appendChild(link);
              return () => {
              document.head.removeChild(link);
          };
      }, []);

    const location = useLocation();
    // si llega un número desde la tabla, lo agrega al state
    useEffect(() => {
      if (location.state?.numero) {
        const numeroRecibido = location.state.numero.toString();
        setNumbers([numeroRecibido]); // reemplaza los números con el recibido
      }
    }, [location.state]);


 return (
    <>
      <ToastContainer />
      
      <div className="flex h-screen w-full font-sans bg-white overflow-hidden" style={inputStyle}>

        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
            {/* 🔹 BOTONES SIMPLIFICADOS - Solo QR desaparece cuando está logueado */}
            <div className="flex justify-between items-center w-full max-w-[1400px] gap-4 mx-auto">
              {/* Contenedor izquierdo - Botón QR o Cerrar sesión WhatsApp + Indicador de estado */}
              <div className="flex gap-3 items-center">
                {!loggedIn ? (
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="bg-[#17243D] hover:bg-[#0f1b2a] text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    QR
                  </button>
                ) : (
                  <button
                    onClick={cerrarSesionWhatsapp}
                    className="bg-[#EF3340] hover:bg-[#b71c1c] text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    Desconectar
                  </button>
                )}

                {/* Indicador de estado - punto de color + texto */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      (() => {
                        const s = (waState || '').toString().toUpperCase();
                        if (s === 'CONNECTED') return 'bg-green-500';
                        if (s === 'OPENING' || s === 'PAIRING') return 'bg-yellow-500';
                        if (s === 'CONFLICT' || s === 'TIMEOUT' || s === 'UNPAIRED' || s === 'DISCONNECTED') return 'bg-red-500';
                        return 'bg-gray-500';
                      })()
                    }`}
                    title="Estado de WhatsApp en el backend"
                  />
                  <span className="text-xs text-[#17243D] font-semibold">
                    {waState === 'CONNECTED' ? 'Conectado' : waState === 'OPENING' ? 'Abriendo' : waState === 'PAIRING' ? 'Emparejando' : waState === 'DISCONNECTED' ? 'Desconectado' : waState || (loggedIn ? 'Conectado' : 'NO LISTO')}
                  </span>
                </div>
              </div>

              {/* Contenedor derecho - Botón Enviar (siempre visible) */}
              <div className="flex-1 flex justify-end">
                <button
                  onClick={handleNumbersSend}
                  disabled={sending || !loggedIn}
                  className="flex items-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-50 w-full max-w-[100px]"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  {sending ? "Enviando.." : "Enviar"}
                </button>
              </div>
            </div>

            {/* Modal QR */}
            {showQrModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-50 text-[#17243D] p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-300">
                  <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Escanea este QR</h3>

                  {qr ? (
                    qr.startsWith("data:image") ? (
                      <img src={qr} alt="QR de WhatsApp" className="w-[256px] h-[256px] object-contain" />
                    ) : (
                      <QRCode value={qr} size={256} />
                    )
                  ) : (
                    <p className="text-gray-500">Esperando QR...</p>
                  )}

                  <button
                    onClick={() => setShowQrModal(false)}
                    className="mt-4 bg-gray-100 text-[#17243D] px-3 py-1 rounded-md hover:bg-gray-200 transition border border-gray-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}


          <fieldset className="border-2 border-[#17243D] p-5 shadow-lg text-[#17243D] mt-1 w-full max-w-[1050px] mx-auto">
            <legend className="text-xl font-bold text-[#ffff] bg-[#17243D] px-4 py-1">
              Números de Contacto
            </legend>

            {/* 🔹 Números de contacto */}
              <div className="flex flex-wrap gap-3 p-3 border border-gray-300 bg-[#dee2e6] min-h-[56px] max-h-48 overflow-auto rounded-md">

                {/* Lista de números añadidos */}
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 border border-gray-300 text-[#17243D] px-2 py-1 rounded-md text-sm"
                  >
                    <span className="mr-2">{num}</span>
                    <button
                      className="text-gray-400 hover:text-[#D4AF37] transition"
                      onClick={() => removeNumber(num)}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Textarea para ingresar números */}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const regex = /[,|\n]/g;
                
                      const partes = inputValue
                        .split(regex)
                        .map(num => num.trim())
                        .filter(num => num.length > 0);
                
                      const validos = [];
                      const invalidos = [];
                
                      partes.forEach(num => {
                        if (
                          /^09\d{8}$/.test(num) && //  Formato válido
                          !/^(.)\1{9}$/.test(num) && //  Todos los dígitos iguales
                          !/(0123456789|1234567890|9876543210)/.test(num) //  Secuencias obvias
                        ) {
                          validos.push(num);
                        } else {
                          invalidos.push(num);
                        }
                      });
                
                      if (validos.length > 0) {
                        setNumbers(prev => {
                          const nuevos = validos.filter(num => !prev.includes(num));
                          return [...prev, ...nuevos];
                        });
                      }
                
                      if (invalidos.length > 0) {
                        toast.error(
                          `Números inválidos: ${invalidos.join(", ")}`,
                          { autoClose: 4000 }
                        );
                      }
                
                      setInputValue("");
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const texto = e.clipboardData.getData("text");
                    const regex = /[,|\n]/g;
                
                    const partes = texto
                      .split(regex)
                      .map(num => num.trim())
                      .filter(num => num.length > 0);
                
                    const validos = [];
                    const invalidos = [];
                
                    partes.forEach(num => {
                      if (
                        /^09\d{8}$/.test(num) &&
                        !/^(.)\1{9}$/.test(num) &&
                        !/(0123456789|1234567890|9876543210)/.test(num)
                      ) {
                        validos.push(num);
                      } else {
                        invalidos.push(num);
                      }
                    });
                
                    if (validos.length > 0) {
                      setNumbers(prev => {
                        const nuevos = validos.filter(num => !prev.includes(num));
                        return [...prev, ...nuevos];
                      });
                    }
                
                    if (invalidos.length > 0) {
                      toast.error(
                        `Números inválidos: ${invalidos.join(", ")}`,
                        { autoClose: 4000 }
                      );
                    }
                  }}
                  placeholder="Pegue o escriba los números y luego sepárelos con una coma o enter"
                  className="flex-1 min-w-[180px] text-sm placeholder-gray-400 rounded-md bg-gray-100 border border-gray-300 text-[#17243D] px-2 py-3 
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37] overflow-auto min-h-[45.3px] max-h-[200px] resize-none"
                  style={{ height: inputHeight }}
                />



                {/* Combobox de tipo */}
                <div className="flex flex-col text-[#17243D]">
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-[#17243D] px-3 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Administrativas">Administrativas</option>
                    <option value="Académicas">Académicas</option>
                    <option value="Extracurriculares">Extracurriculares</option>
                  </select>
                </div>
              </div>

              {/* 🔹 Selección de contactos por carreras con lógica de fetch */}
              <div className="w-full max-w-[1100px] mx-auto mt-5">
                <h3 className="text-1xl font-bold text-left text-[#17243D] mb-5">
                  Seleccionar contactos por carrera
                </h3>
              
               <div className="flex flex-wrap justify-center gap-15">
                {["Todos", "TSDS", "TSEM", "TSASA", "TSPIM", "TSPA", "TSRT"].map((carrera) => {
               const carrerasInd = ["TSDS", "TSEM", "TSASA", "TSPIM", "TSPA", "TSRT"];
                  const checked =
                      carrera === "Todos"
                    ? carrerasInd.every(c => !!resultadosCarrera[c]?.length)
                    : !!resultadosCarrera[carrera]?.length;
                    
                    const cantidad =
                    carrera === "Todos"
                    ? carrerasInd.reduce((acc, c) => acc + (resultadosCarrera[c]?.length || 0), 0)
                    : resultadosCarrera[carrera]?.length || 0;
              
               return (
                      <div
                        key={carrera}
                        className="flex items-center cursor-pointer transition-all rounded-lg"
                      >
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-full appearance-none border border-gray-400 checked:bg-[#17243D] checked:border-transparent focus:ring-[#17243D]"
                            checked={
                              carrera === "Todos"
                                ? carrerasInd.every(c => !!resultadosCarrera[c])
                                : !!resultadosCarrera[carrera]
                            }
                            onChange={async (e) => {
                              const checked = e.target.checked;
              
                              if (carrera === "Todos") {
                                if (checked) {
                                  for (const c of carrerasInd) {
                                    if (!resultadosCarrera[c]) {
                                      try {
                                        const { data } = await axios.get(
                                          `${import.meta.env.VITE_BACKEND_URL}/estudiantes?carrera=${c}`,
                                          { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        const numeros = data.map(x => x.numero).filter(Boolean);
                                        setNumbers(prev => Array.from(new Set([...prev, ...numeros])));
                                        setResultadosCarrera(prev => ({ ...prev, [c]: data }));
                                      } catch {
                                        toast.error(`Error al cargar ${c}`);
                                      }
                                    }
                                  }
                                  toast.success("Se agregaron todas las carreras");
                                } else {
                                  setResultadosCarrera({});
                                  setNumbers([]);
                                  toast.info("Se deseleccionaron todas las carreras");
                                }
                                return;
                              }
              
                              try {
                                const { data } = await axios.get(
                                  `${import.meta.env.VITE_BACKEND_URL}/estudiantes?carrera=${carrera}`,
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                const numeros = data.map(x => x.numero).filter(Boolean);
              
                                if (checked) {
                                  setNumbers(prev => Array.from(new Set([...prev, ...numeros])));
                                  setResultadosCarrera(prev => ({ ...prev, [carrera]: data }));
                                  toast.info(`Se agregaron ${numeros.length} números de ${carrera}`);
                                } else {
                                  setNumbers(prev => prev.filter(n => !numeros.includes(n)));
                                  setResultadosCarrera(prev => {
                                    const nuevo = { ...prev };
                                    delete nuevo[carrera];
                                    return nuevo;
                                  });
                                  toast.info(`Se quitó ${carrera}`);
                                }
                              } catch (error) {
                                console.error("Error al obtener estudiantes:", error);
                                toast.error("Error al obtener los estudiantes");
                              }
                            }}
                          />
                          <span className={`font-semibold ${checked ? "text-[#17243D]" : "text-[#17243D]"}`}>
                            {carrera}
                          </span>
                        </label>
                      </div>
                    );
                  })}
               </div>
              </div>



          </fieldset>
          {/* 🔹 Editor de mensaje */}
          <fieldset className="border-2 border-[#17243D] p-6 shadow-lg text-[#17243D] mt-5 w-full max-w-[1050px] mx-auto">
            <legend className="text-xl font-bold text-[#ffff] bg-[#17243D] px-4 py-1">
              Mensaje
            </legend>
          
            {/* Selección de archivos */}
            <div className="flex flex-col items-end w-full ">
              <label className="flex items-center gap-3 bg-gray-100 border border-gray-300 px-3 py-2 rounded-md cursor-pointer font-medium hover:bg-gray-200 transition">
                <PhotoIcon className="w-5 h-5 text-[#D4AF37]" />
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  value=""
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Puedes subir hasta <span className="font-semibold">3 imágenes</span> y <span className="font-semibold">3 documentos</span>.
              </p>
            </div>
          
            {/* Editor de TinyMCE */}
            <div className="w-full bg-gray-50 text-[#17243D] rounded-lg border border-gray-300 p-5 shadow-sm mt-5">
              <Editor
                apiKey="w7q3mgtdwp4f5ula0nkgydefa1gjemobhbkqksmyeh0dddub"
                value={message}
                onEditorChange={(content) => setMessage(content)} // 🔹 Aquí guardamos todo el HTML
                init={{
                  width: "100%",
                  height: 400,
                  menubar: false,
                  plugins: ["link", "lists", "paste"],
                  toolbar: "undo redo | bold italic | bullist numlist | link",
                  branding: false,
                  skin: "oxide-dark",
                  content_css: "dark",
                  content_style: `
                    body { background-color: #f9f9f9; color: #17243D; font-family: 'Gowun Batang', serif; }
                    ::placeholder { color: #888888; }
                  `,
                }}
              />
            </div>
          
            {/* Preview de archivos */}
            {files.length > 0 && (
              <div className="w-full max-w-[1400px] mt-5 bg-gray-100 text-[#17243D] rounded-lg border border-gray-300 p-4 flex flex-wrap gap-4 shadow-sm mx-auto">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getFilePreview(file)}
                      alt={`preview ${index}`}
                      className="w-28 h-28 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-gray-100 text-[#17243D] rounded-full p-1 border border-gray-300 opacity-0 group-hover:opacity-100 transition"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>


        </main>
      </div>
    </div>
  </>
);


};

const inputStyle = { fontFamily: "Gowun Batang, serif" };

export default EnviarMensaje;



