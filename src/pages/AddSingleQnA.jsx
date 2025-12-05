import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import storeAuth from '../context/storeAuth';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSingleQnA = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      pregunta: '',
      respuesta: '',
      categoria: 'General',
    }
  });

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategoria, setSelectedCategoria] = useState('General');

  const pregunta = watch('pregunta');
  const respuesta = watch('respuesta');

  const categorias = [
    "Matrículas","Quienes Somos", "Oferta Académica", "Admisiones", "Unidad Titulación", 
    "Estudiantes", "Comunidad", "Vinculacion Social", "Transparencia", 
    "Prácticas Pre-profesionales", "Calendario", "Contacto", "General", "Vinculación" 
  ];

  // Validación de pregunta: debe iniciar con ¿ y terminar con ?
  const validatePregunta = (value) => {
    if (!value || value.length === 0) return true; // El campo required lo valida
    if (value.length < 3) return 'La pregunta debe tener al menos 3 caracteres';
    if (!/^¿\s*(Qué|Cuál|Cuáles|Quién|Quiénes|Dónde|Cuánto|Cuántos|Cómo|Por qué|En qué)\b[\s\S]*\?$/i.test(value.trim())) {
      return 'La pregunta debe estar en formato ¿Qué...? ¿Cuál...? etc.';
    }
    if (value.length > 300) return 'La pregunta no puede exceder 300 caracteres';
    return true;
  };

  // Validación de respuesta: permite letras, números, espacios, puntuación y guion bajo
  const validateRespuesta = (value) => {
    if (!value || value.length === 0) return true;
    if (value.length < 5) return 'La respuesta debe tener al menos 5 caracteres';
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,;:\-_\n\r]*$/.test(value.trim())) {
      return 'La respuesta solo puede contener letras, números, espacios, puntuación y guion bajo (_)';
    }
    if (value.length > 500) return 'La respuesta no puede exceder 500 caracteres';
    return true;
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

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const token = storeAuth.getState().token;
      const response = await fetch(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/api/agregar-qa-pasante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          pregunta: data.pregunta.trim(),
          respuesta: data.respuesta.trim(),
          categoria: selectedCategoria
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Pregunta y respuesta agregadas exitosamente!', {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Limpiar formulario
        reset();
        setSelectedCategoria('General');
        
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        const errorMsg = responseData.messages?.[0] || responseData.error || 'Error desconocido';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`Error de conexión: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="w-full bg-white px-10 py-2 flex flex-col" style={inputSyle}>
        <h1 className="font-black text-4xl text-black pt-7">Preguntas</h1>
        <hr className="my-4 border-t-2 border-[#17243D]" />
        <p className="mb-8 text-black">Este módulo te permite alimentar el Chatbot con IA</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Categoría y Botón - EN LA MISMA LÍNEA */}
          <div className="flex gap-4 items-end justify-between">
            <div className="w-48 relative">
              <label htmlFor="categoria" className="block text-sm font-semibold text-[#17243D] mb-2">
                Categoría
              </label>
              <button
                type="button"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] bg-[#dee2e6] text-[#17243D] transition-colors text-left text-sm"
                onClick={() => setShowDropdown((prev) => !prev)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              >
                {selectedCategoria}
              </button>
              {showDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
                >
                  {categorias.map((cat) => (
                    <li
                      key={cat}
                      className={`px-3 py-3 cursor-pointer transition-colors text-sm ${selectedCategoria === cat ? 'bg-[#a1d5d3] text-[#17243D]' : 'hover:bg-[#a1d5d3] hover:text-[#17243D]'}`}
                      onMouseDown={() => {
                        setSelectedCategoria(cat);
                        setShowDropdown(false);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Botón Guardar - MÁS A LA DERECHA */}
            <button 
              type="submit" 
              disabled={loading || !pregunta.trim() || !respuesta.trim() || Object.keys(errors).length > 0}
              className="bg-[#17243D] hover:bg-[#0f1a2a] text-white font-bold py-3 px-8 rounded-md transition-all duration-200 text-base flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar</span>
              )}
            </button>
          </div>

          {/* Campo Pregunta */}
          <div>
            <label htmlFor="pregunta" className="block text-sm font-semibold text-[#17243D] mb-2">
              Pregunta *
            </label>
            <textarea
              id="pregunta"
              placeholder="Ej: ¿Cuál es el horario de atención?"
              maxLength="300"
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors bg-[#dee2e6] text-[#000000] ${
                errors.pregunta ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]'
              }`}
              {...register('pregunta', {
                required: 'La pregunta es obligatoria',
                validate: validatePregunta
              })}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-right text-sm text-gray-500">
                {pregunta.length}/300
              </div>
              {errors.pregunta && (
                <p className="text-red-500 text-sm">{errors.pregunta.message}</p>
              )}
            </div>
          </div>

          {/* Campo Respuesta */}
          <div>
            <label htmlFor="respuesta" className="block text-sm font-semibold text-[#17243D] mb-2">
              Respuesta *
            </label>
            <textarea
              id="respuesta"
              placeholder="Ej: El horario de atención es de lunes a viernes de 8:00 a 17:00..."
              maxLength="500"
              rows="5"
              className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors bg-[#dee2e6] text-[#000000] ${
                errors.respuesta ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA]'
              }`}
              {...register('respuesta', {
                required: 'La respuesta es obligatoria',
                validate: validateRespuesta
              })}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-right text-sm text-gray-500">
                {respuesta.length}/500
              </div>
              {errors.respuesta && (
                <p className="text-red-500 text-sm">{errors.respuesta.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default AddSingleQnA;