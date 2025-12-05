import { useState, useRef, useEffect} from "react";
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";
import {ToastContainer, toast} from 'react-toastify';

export const CardProfile = () => {
    const { user, uploadAvatar, deleteAccount } = storeProfile();
    const { clearToken } = storeAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [iaImage, setIaImage] = useState(null);
    const [formulariosPendientes, setFormulariosPendientes] = useState(false);
    const fileInputRef = useRef(null);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleUploadImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await uploadAvatar(file, user._id);
            setShowMenu(false);
        } catch (error) {
            console.error("Error subiendo imagen:", error);
        }
    };

    const handleDelete = async () => {
        // Verificar si hay formularios pendientes
        if (formulariosPendientes) {
            toast.error("No puedes eliminar tu cuenta mientras tengas formularios pendientes. Por favor, completa o cancela los formularios pendientes primero.");
            return;
        }

        const confirmed = window.confirm(
            "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
        );
        if (!confirmed) return;

        const response = await deleteAccount(user._id);
        if (response) {
            setTimeout(() => {
                clearToken();
            }, 2000);
        }
    };



    function getHDImage(url) {
        if (!url) return url;
        if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
            return url.replace(/=s\d+/, "=s1024");
        }
        return url; 
        }

    useEffect(() => {
            const link = document.createElement("link");
            link.href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
            link.rel = "stylesheet";
            document.head.appendChild(link);
            return () => {
            document.head.removeChild(link);
        };
        }, []);

    // Verificar formularios pendientes del estudiante
    useEffect(() => {
        const verificarFormulariosPendientes = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("auth-token"));
                const emailUsuario = storedUser?.state?.user?.email?.trim().toLowerCase();

                if (!emailUsuario) return;

                const res = await fetch(
                    import.meta.env.VITE_N8N_BACKEND_URL_E,
                    { method: "GET", headers: { "Content-Type": "application/json" } }
                );

                if (!res.ok) return;

                const data = await res.json();
                const formularios = Array.isArray(data) ? data.map(item => item.json || item) : [];

                // Filtrar por email del estudiante actual y verificar si está pendiente
                const formularioEstudiante = formularios.find(f => 
                    f.email?.trim().toLowerCase() === emailUsuario
                );

                const tienePendientes = formularioEstudiante && formularioEstudiante.estado === "Pendiente";
                setFormulariosPendientes(tienePendientes);
            } catch (error) {
                console.error("Error verificando formularios:", error);
            }
        };

        verificarFormulariosPendientes();
    }, [user?.email]);

return (
    <div className="bg-[#dee2e6] rounded-lg h-auto p-4 flex flex-col items-center justify-between shadow-xl py-1 px-2 pt-[20px] pb-[10px]">
        <ToastContainer/>
        <div className="relative">
            <img
                src={
                    getHDImage(user?.avatarUsuario) ||
                    "src/assets/usuarioSinfoto.jpg"
                }
                className="h-40 w-40 rounded-full object-cover mx-auto"
            />
            <label
                onClick={toggleMenu}
                className="absolute bottom-0 right-0 bg-[#dee2e6] text-[#17243D] rounded-full p-2 cursor-pointer hover:bg-[#20B2AA] select-none"
                title="Opciones de imagen"
            >
                📷
            </label>

            {showMenu && (
                <div className="absolute bottom-12 right-0 bg-gray-800 p-3 rounded shadow-lg flex flex-col gap-2 z-50">
                    <button
                        className="text-white hover:bg-gray-700 px-3 py-1 rounded"
                        onClick={handleUploadImageClick}
                        disabled={generating}
                    >
                        Subir imagen
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>

        <div className="text-[#17243D] text-center mt-6 space-y-2">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Gowun Batang, serif' }}>
                {user?.nombre}
            </h2>
            <p className="text-sm" style={inputStyle}>{user?.email}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-[20px] w-full max-w-md mx-auto" style={inputStyle}>
            <div className="flex items-center gap-1 text-[#17243D]">
                <b>Estado:</b>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#20B2AA] rounded-full"></span>
                    <p className="text-[#20B2AA] text-xs font-medium">
                        {user?.status ? "Activo" : "Inactivo"}
                    </p>
                </span>
            </div>

            {user?.rol == "estudiante" && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={formulariosPendientes}
                    className={`px-3 py-1 text-sm uppercase font-bold cursor-pointer transition-all ${
                        formulariosPendientes
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-[#dee2e6] text-[#17243D] hover:bg-[#20B2AA] hover:text-black"
                    }`}
                    title={formulariosPendientes ? "No puedes eliminar tu cuenta mientras tengas formularios pendientes" : "Eliminar cuenta"}
                >
                    Eliminar Cuenta
                </button>
            )}
        </div>
    </div>
);

};

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};

export default CardProfile;
