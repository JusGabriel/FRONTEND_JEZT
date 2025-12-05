import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

export const Forgot = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { fetchDataBackend } = useFetch();

    const sendMail = (data) => {
      const payload = {
        email: data.email?.trim(),
      };

      fetchDataBackend(`${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`, payload, 'POST');
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
  <div className="flex flex-col sm:flex-row h-screen " style={inputStyle}>

    <ToastContainer />

    {/* ------------------- Panel de formulario ------------------- */}
    <div className="w-full sm:w-4/12 h-screen bg-white flex justify-center items-center">
      <div className="md:w-4/5 sm:w-full px-4">

        {/* Logo */}
        <div className="w-[140px] h-[140px] mx-auto flex items-center justify-center rounded-full border-4 border-[#20B2AA] mb-5">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4 text-center text-[#17243D]">
          Recuperar contraseña
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit(sendMail)} className="w-full flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col w-full">
            <input 
              type="email" 
              placeholder="Correo electrónico"
              className="p-3 mt-1 block w-full bg-[#dee2e6] rounded-lg text-[#17243D]"
              {...register("email", { required: "El correo electrónico es obligatorio" })}
            />
            {errors.email && (
              <p className="text-red-800 text-sm mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Botón */}
          <div className="flex justify-center">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 mt-4 w-full"
            >
              Enviar correo
            </button>
          </div>
        </form>

        {/* Link a login */}
        <div className="mt-5 text-sm flex justify-center items-center gap-3">
          <p className="text-[#17243D]">¿Ya posees una cuenta?</p>
          <Link to="/login" 
            className="flex items-center justify-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-6 py-2 rounded-md font-medium transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>

    {/* ------------------- Panel de imagen ------------------- */}
    <div
      className="w-full sm:w-8/12 h-1/3 sm:h-screen sm:block hidden relative overflow-hidden"
      style={{
        backgroundImage: "url('/fondo-olvido.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.9) contrast(1.1) saturate(1.2)",
      }}
    >
      {/* Overlay opcional para textura o suavizado */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(255,255,255,0.05)", // ligero efecto de textura
          mixBlendMode: "soft-light",
        }}
      />
    </div>

  </div>
);

};
// Mantiene tu diseño original
const inputStyle = {
  fontFamily: "Gowun Batang, serif",
};

export default Forgot;
