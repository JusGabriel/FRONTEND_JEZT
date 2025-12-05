import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "./storeAuth";


const getAuthHeaders = () => {
  const token = storeAuth.getState().token;
  if (!token) throw new Error("No existe el token de autenticación");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const storeProfile = create((set) => ({
  user: null,

  // Guardar usuario en Zustand
  setUser: (userData) => set({ user: userData }),

  clearUser: () => {
    set({ user: null });
  },

  // Obtener el perfil (admin, pasante o estudiante)
  profile: async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`;
      const respuesta = await axios.get(url, getAuthHeaders());
      set({ user: respuesta.data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // Actualizar información del usuario
  updateProfile: async (data, id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      set({ user: respuesta.data });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  // Cambiar contraseña
  updatePasswordProfile: async (data, id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil/actualizarpassword/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      toast.success("Contraseña actualizada correctamente", {
        onClose: () => {
          storeAuth.getState().clearAuth();
          window.location.href = "/login";
        },
        autoClose: 2000 // 2 segundos para que se vea el toast
      });
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  // Eliminar cuenta
  deleteAccount: async (id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil/eliminar/${id}`;
      const respuesta = await axios.delete(url, getAuthHeaders());
      toast.success("Tu cuenta ha sido eliminada correctamente");
      set({ user: null });
      setTimeout(() => {
        window.location.href = "/login";
        window.location.reload();
      }, 800);
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  // Subir imagen de perfil
  uploadAvatar: async (file, id) => {
    try {
      const token = storeAuth.getState().token;
      if (!token) throw new Error("No hay token guardado");

      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil/imagen/${id}`;
      const formData = new FormData();
      formData.append("imagen", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const loadingToast = toast.loading("Procesando...");

      const respuesta = await axios.put(url, formData, config);

      toast.dismiss(loadingToast);
      toast.success("Imagen actualizada correctamente");

      set({ user: respuesta.data });

      setTimeout(() => {
        window.location.reload();
      }, 800);

      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Error al subir la imagen");
      throw error;
    }
  },
}));
export default storeProfile;
