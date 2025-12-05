import storeProfile from "../../context/storeProfile";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const FormularioPerfil = () => {
  const { user, updateProfile } = storeProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const updateUser = async (data) => {
    updateProfile(data, user._id);
  };

  // Cargar datos del usuario actual
  useEffect(() => {
    if (user) {
      reset({
        nombre: user?.nombre,
        apellido: user?.apellido,
        email: user?.email,
        username: user?.username,
      });
    }
  }, [user, reset]);

  // Cargar fuente
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // ============================
  // ✅ VALIDACIÓN FRONT Username único (solo frontend por ahora)
  // ============================
  const validarUsernameUnico = async (value) => {
    // ⚠️ Simulación temporal: evita que se use "admin" o "test" por ejemplo
    const usuariosNoPermitidos = ["admin", "test", "usuario", "demo"];

    await new Promise((resolve) => setTimeout(resolve, 300)); // simula delay de API

    if (usuariosNoPermitidos.includes(value?.toLowerCase())) {
      return "Este nombre de usuario ya está en uso.";
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit(updateUser)} style={inputSyle}>
      {/* NOMBRE */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#17243D]">Nombre</label>
        <input
          type="text"
          placeholder={user?.nombre || ""}
          className="block w-full rounded-lg py-1 px-2 bg-[#dee2e6] mb-5 text-[#000000]"
          {...register("nombre", {
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/,
              message:
                "Debe iniciar con mayúscula y contener solo letras (ej. 'Carlos' o 'Ana María').",
            },
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 20,
              message: "El nombre no puede exceder los 20 caracteres.",
            },
          })}
        />
        {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
      </div>

      {/* APELLIDO */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#17243D]">Apellido</label>
        <input
          type="text"
          placeholder={user?.apellido || ""}
          className="block w-full rounded-lg py-1 px-2 bg-[#dee2e6] mb-5 text-[#000000]"
          {...register("apellido", {
            required: "El apellido es obligatorio",
            pattern: {
              value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/,
              message:
                "Debe iniciar con mayúscula y contener solo letras (ej. 'Ramírez' o 'De la Cruz').",
            },
            minLength: {
              value: 2,
              message: "El apellido debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 20,
              message: "El apellido no puede exceder los 20 caracteres.",
            },
          })}
        />
        {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
      </div>

      {/* USUARIO */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#17243D]">Nombre de usuario</label>
        <input
          type="text"
          placeholder={user?.username || ""}
          className="block w-full rounded-lg py-1 px-2 bg-[#dee2e6] mb-5 text-[#000000]"
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
            minLength: {
              value: 3,
              message: "El usuario debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 20,
              message: "El usuario no puede exceder los 20 caracteres.",
            },
            pattern: {
              value: /^[a-zA-Z0-9._-]+$/,
              message: "Solo se permiten letras, números, puntos y guiones.",
            },
            validate: validarUsernameUnico, // ✅ validación asíncrona
          })}
        />
        {errors.username && <p className="text-red-800">{errors.username.message}</p>}
      </div>

      {/* EMAIL */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#17243D]">Email</label>
        <input
          type="email"
          placeholder={user?.email || ""}
          className="block w-full rounded-lg py-1 px-2 bg-[#dee2e6] mb-5 text-[#000000]"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Debe ser un correo electrónico válido (ej. usuario@gmail.com).",
            },
            maxLength: {
              value: 30,
              message: "El email no puede exceder los 20 caracteres.",
            },
          })}
        />
        {errors.email && <p className="text-red-800">{errors.email.message}</p>}
      </div>

      {/* BOTÓN */}
      <div className="flex justify-center mt-4">
        <input
          type="submit"
          className="flex items-center gap-2 bg-[#17243D] hover:bg-[#EF3340] text-white px-8 py-2 rounded-md font-medium transition disabled:opacity-50"
          value="Actualizar"
        />
      </div>
    </form>
  );
};

// Mantiene tu diseño original
const inputSyle = {
  fontFamily: "Gowun Batang, serif",
};

export default FormularioPerfil;
