
import axios from "axios";
import { toast } from "react-toastify";


function useFetch() {
    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {
        const loadingToast = toast.loading("Procesando solicitud...");
        try {
            const options = {
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                data,
            };
            const response = await axios(options);
            toast.dismiss(loadingToast);
            toast.success(response?.data?.msg);
            return response?.data;
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error(error);
            
            // 🔹 Si el token caducó (401 o 403), eliminarlo del localStorage
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("auth-token");
                toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                // Redirigir al login
                window.location.href = "/login";
                return null;
            }
            
            toast.error(error.response?.data?.msg || "Error en la solicitud");
            return null;
        }
    };
    return { fetchDataBackend };
}

export default useFetch;
