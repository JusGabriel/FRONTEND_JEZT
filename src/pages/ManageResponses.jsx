import storeAuth from '../context/storeAuth';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from 'react-hook-form';

// Componente para editar respuesta con react-hook-form
const EditarRespuestaForm = ({ respuestaActual, onGuardar, onCancelar, validateRespuesta }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      respuesta: respuestaActual
    }
  });

  const respuestaValue = watch('respuesta');

  const onSubmit = (data) => {
    onGuardar(data.respuesta);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-[#17243D] mb-2">Nueva respuesta *</label>
        <textarea
          {...register('respuesta', {
            required: 'La respuesta es obligatoria',
            validate: validateRespuesta
          })}
          placeholder="Escribe la respuesta corregida..."
          rows="5"
          maxLength="500"
          className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors bg-[#dee2e6] text-[#000000] ${
            errors.respuesta ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="text-right text-sm text-gray-500">
            {respuestaValue?.length || 0}/500
          </div>
          {errors.respuesta && (
            <p className="text-red-500 text-sm">{errors.respuesta.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !respuestaValue?.trim()}
          className="bg-[#17243D] hover:bg-[#0f1a2a] text-white font-bold py-1.5 px-3 md:py-3 md:px-8 rounded-md transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar 
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1.5 px-3 md:py-3 md:px-8 rounded-md transition-all duration-200 text-sm md:text-base"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};


const GestionRespuestas = () => {
  const [respuestasProblema, setRespuestasProblema] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null);

  // Validar respuesta
  const validateRespuesta = (value) => {
    if (!value || value.trim().length < 5) {
      return 'La respuesta debe tener al menos 5 caracteres';
    }
    // Solo caracteres estándar, permitiendo guiones bajos (_)
    const regexRespuesta = /^[a-záéíóúñ\s.,;:!?¿¡()_\-"'àâäçèéêëìîïòôöùûüß0-9]+$/i;
    if (!regexRespuesta.test(value.trim())) {
      return 'La respuesta contiene caracteres no permitidos. Solo se permiten letras, números, espacios y estos caracteres: . , ; : ! ? ¿ ¡ ( ) _ -';
    }
    if (value.length > 500) {
      return 'La respuesta no puede exceder 500 caracteres';
    }
    return true;
  };


  // Cargar respuestas problema
  const cargarRespuestasProblema = async () => {
    setLoading(true);
    try {
      const token = storeAuth.getState().token;
      const response = await axios.get(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/api/pasante/respuestas-problema`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setRespuestasProblema(response.data.data || []);
    } catch (error) {
      toast.error("Error al cargar respuestas problema");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar respuesta
  const actualizarRespuesta = async (idRespuesta, nuevaRespuesta) => {
    try {
      const token = storeAuth.getState().token;
      const response = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/api/pasante/procesar-respuesta-problema`, {
        id_respuesta: idRespuesta,
        nueva_respuesta: nuevaRespuesta.trim()
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        toast.success("Respuesta actualizada exitosamente");
        setEditando(null);
        cargarRespuestasProblema();
      } else {
        toast.error(" Error: " + response.data.error);
      }
    } catch (error) {
      toast.error("No se pudo actualizar respuesta");
    }
  };

  useEffect(() => {
    cargarRespuestasProblema();
  }, []);

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
    <ToastContainer />
    <div className="w-full bg-white flex flex-col px-10 py-2" style={inputSyle}>
      <h1 className="font-black text-4xl text-black pt-7">Respuestas</h1>
      <hr className="my-4 border-t-2 border-[#17243D]" />
      <p className="mb-8 text-black">Este módulo te permite solventar problemas del Chatbot con IA</p>
      {respuestasProblema.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {loading ? "Cargando respuestas..." : "🎉 No hay respuestas problemáticas"}
          </p>
          <p className="text-gray-400 mt-2">
            Las respuestas con calificación menor a 3 aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {respuestasProblema.map((respuesta) => (
            <div key={respuesta.id} className="border-2 border-gray-950  p-6 bg-white shadow-lg text-[#17243D]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <label className="block text-base font-bold mb-1">
                    {respuesta.requiere_correccion && respuesta.pregunta_usuario_original
                      ? "Pregunta del usuario:"
                      : "Pregunta:"}
                  </label>
                  <div className="bg-[#dee2e6] rounded-lg px-3 py-2 text-black mb-2">
                    {respuesta.requiere_correccion && respuesta.pregunta_usuario_original
                      ? respuesta.pregunta_usuario_original
                      : respuesta.pregunta}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    respuesta.calificacion_actual < 2 ? 'bg-red-100 text-red-800' :
                    respuesta.calificacion_actual < 3 ? 'bg-[#a1d5d3] text-[#17243D]' :
                    'bg-[#a1d5d3] text-[#17243D]'
                  }`}>
                    Calificación: {respuesta.calificacion_actual}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {respuesta.total_calificaciones} calificaciones
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-base font-bold mb-1">Respuesta actual:</label>
                <div className="bg-[#dee2e6] rounded-lg px-3 py-2 text-black ">
                  {respuesta.respuesta_actual}
                </div>
              </div>

              {editando === respuesta.id ? (
                <EditarRespuestaForm 
                  respuestaActual={respuesta.respuesta_actual}
                  onGuardar={(nuevaRespuesta) => {
                    actualizarRespuesta(respuesta.id, nuevaRespuesta);
                  }}
                  onCancelar={() => setEditando(null)}
                  validateRespuesta={validateRespuesta}
                />
              ) : (
                <div className="flex mt-2 gap-2">
                  <button
                    onClick={() => setEditando(respuesta.id)}
                    className="bg-[#17243D] hover:bg-[#0f1a2a] text-white font-bold py-1.5 px-3 md:py-3 md:px-8 rounded-md transition-all duration-200 text-sm md:text-base"
                  >
                    Corregir Respuesta
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('¿Estás seguro de eliminar esta respuesta?')) {
                        try {
                          const token = storeAuth.getState().token;
                          const response = await axios.post(
                            `${import.meta.env.VITE_PYTHON_BACKEND_URL}/api/pasante/eliminar-respuesta`,
                            { id_respuesta: respuesta.id },
                            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
                          );
                          if (response.data.success) {
                            toast.success('Respuesta eliminada correctamente');
                            cargarRespuestasProblema();
                          } else {
                            toast.error('Error al eliminar: ' + response.data.error);
                          }
                        } catch (error) {
                          toast.error('Error al eliminar respuesta');
                        }
                      }
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1.5 px-3 md:py-3 md:px-8 rounded-md transition-all duration-200 text-sm md:text-base"
                  >
                    Eliminar
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-4">
                <span>Categoría: {respuesta.categoria}</span>
                {respuesta.fuente && <span>Fuente: {respuesta.fuente}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};


// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};



export default GestionRespuestas;

