import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    return () => {
      document.head.removeChild(link);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 const onSubmit = async (data) => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([key, v]) => {
        // Convertir a string si es booleano (terminos checkbox)
        if (typeof v === 'boolean') return [key, v];
        // Validar y limpiar strings
        if (typeof v === 'string' && v.trim() !== "") return [key, v.trim()];
        // Filtrar valores vacíos o no-string
        return [key, null];
      }).filter(([_, v]) => v !== null)
    );
    // Validar que el email pertenezca al dominio @epn.edu.ec
    const email = (cleanData.email || "").toString().toLowerCase();
    if (!email.endsWith("@epn.edu.ec")) {
      toast.error("El correo debe pertenecer al dominio @epn.edu.ec");
      return;
    }
    const url = `${import.meta.env.VITE_BACKEND_URL}/register`;
    const res = await axios.post(url, { ...cleanData, rol: "estudiante" }, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.msg || "Registro exitoso ");
    // Limpiar el formulario después de un registro exitoso
    reset();
  } catch (error) {
    console.error("Error en el registro:", error.response?.data || error.message);

    if (error.response?.data?.msg) {
      toast.error(error.response.data.msg);
    } else {
      toast.error("Error en el registro");
    }
  }
};



return (
  <div className="flex w-screen h-screen fixed top-0 left-0 overflow-hidden font-['Gowun_Batang',serif] bg-[#ffff]">
    <div className="flex w-full h-full">

      {/* ------------------- Panel de imagen ------------------- */}
      {windowWidth >= 1000 && (
        <div className="relative w-2/3 h-full bg-gradient-to-br from-[#1a1a28] via-[#0b0b10] to-[#1a1a28] overflow-hidden">
          <img
            src="/fondo-registro.jpeg"
            alt="Fondo de registro"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000cc] to-[#00000066]" />
          <div className="absolute bottom-16 left-16 z-10">
            <h1 className="text-5xl text-[#ffff] font-bold drop-shadow-lg mb-2">
              ¡Bienvenido!
            </h1>
            <p className="text-gray-200 text-lg max-w-md">
              Regístrate y forma parte de nuestra comunidad de estudiantes.
            </p>
          </div>
        </div>
      )}

      {/* ------------------- Panel de formulario (scrollable) ------------------- */}
    <div className="w-full sm:w-4/12 bg-[#ffff] flex justify-center overflow-y-auto">
      <div className="w-full max-w-[500px] px-4 py-10 flex flex-col items-center min-h-screen">

        <h2 className="pt-0 text-4xl pb-5 font-bold text-[#17243D] text-center">
          Registrarse
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col gap-4"
        >
          {/* Nombre */}
          <div className="flex flex-col w-full min-w-0">
            <input
              type="text"
              placeholder="Nombre"
              {...register("nombre", { required: true })}
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.nombre ? "Nombre requerido" : ""}
            </p>
          </div>

          {/* Apellido */}
          <div className="flex flex-col w-full min-w-0">
            <input
              type="text"
              placeholder="Apellido"
              {...register("apellido", { required: true })}
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.apellido ? "Apellido requerido" : ""}
            </p>
          </div>

          {/* Username */}
          <div className="flex flex-col w-full min-w-0">
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: true })}
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.username ? "Usuario requerido" : ""}
            </p>
          </div>

          {/* Número */}
          <div className="flex flex-col w-full min-w-0">
            <input
              type="text"
              placeholder="Número"
              {...register("numero", { required: true })}
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.numero ? "Número requerido" : ""}
            </p>
          </div>

          {/* Carrera */}
          <div className="flex flex-col w-full min-w-0">
            <select
              {...register("carrera", { required: "Selecciona una carrera" })}
              defaultValue=""
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            >
              <option value="" disabled>
                Selecciona una Carrera
              </option>
              <option value="TSDS">Desarrollo de Software</option>
              <option value="TSEM">Electromecánica</option>
              <option value="TSASA">Agua y Saneamiento Ambiental</option>
              <option value="TSPIM">Procesamiento Industrial de la Madera</option>
              <option value="TSPA">Procesamiento de Alimentos</option>
              <option value="TSRT">Redes y Telecomunicaciones</option>
            </select>
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.carrera ? errors.carrera.message : ""}
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col w-full min-w-0">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="p-3 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.email ? "Email requerido" : ""}
            </p>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col w-full min-w-0 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password", { required: true,
                minLength: {
                  value: 14,
                  message: "La contraseña debe tener al menos 14 caracteres"
                }
              })}
              className="p-3 pr-10 w-full bg-[#dee2e6] rounded-lg text-[#17243D] max-w-full"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                </svg>
              )}
            </button>
            <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
              {errors.password?.type === "required"
                ? "Contraseña requerida"
                : errors.password?.type === "minLength"
                ? errors.password.message
                : ""}
            </p>
          </div>
            <button
              type="submit"
            className="flex items-center justify-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 mt-2 shrink"
            >
              Registrarse
            </button>
        </form>

        {/* Aceptar términos */}
        <div className="flex items-start gap-2 mt-3">
          <input
            type="checkbox"
            {...register("terminos", { required: true })}
            className="mt-1 h-4 w-4 cursor-pointer"
          />
          <label className="text-[13px] text-[#17243D] leading-tight cursor-pointer">
            Acepto los{" "}
            <a
              href="https://www.epn.edu.ec/wp-content/uploads/2021/06/POLÍTICA-DE-USO-DE-LA-INFORMACIÓN-ACTIVOS-DE-INFORMACIÓN-INSTITUCIONAL-Y-SEGURIDAD-INFORMÁTICA.-fc-signed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#17243D] font-medium hover:underline"
            >
              Términos y Condiciones
            </a>
          </label>
        </div>

        <p className="text-red-800 h-4 transition-all duration-300" style={errorStyle}>
          {errors.terminos ? "Debes aceptar los términos para continuar" : ""}
        </p>


        {/* ------------------- Enlace a login ------------------- */}
        <p className="text-sm mt-4 text-center pb-5 ">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-[#17243D] hover:underline">
            Inicia sesión
          </Link>
        </p>

        <ToastContainer />
      </div>
    </div>
  </div>
  </div>
);




}

const inputStyle = {
  fontSize: "15px",
  fontFamily: "Gowun Batang, serif",
};

const errorStyle = {
  color: "#B91C1C", // red-800
  fontSize: "0.875rem", // text-sm = 14px (aprox 0.875rem)
  marginTop: "0.25rem", // mt-1
  marginLeft: "0.25rem", // ml-1
};
