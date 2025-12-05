import bruja from '../assets/logo.png';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';

const Reset = () => {
    const { fetchDataBackend } = useFetch();
    const { token } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [tokenback, setTokenBack] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const changePassword = (data) => {
        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`;
        fetchDataBackend(endpoint, data, 'POST');
        setTimeout(() => {
            if (data.password === data.confirmpassword) {
                navigate('/login');
            }
        }, 3000);
    };

    useEffect(() => {
        const verifyToken = async () => {
            const endpoint = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`;
            const response = await fetchDataBackend(endpoint, null, 'GET');
            if (response) {
                setTokenBack(true);
            }
        };
        verifyToken();
    }, [token]);

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
        <div className="flex flex-col items-center justify-center h-screen" style={letraStyle}>
            <ToastContainer />
            <h1 
                className="text-3xl font-semibold mb-2 text-center text-dark-500" 
            >
                Restablecer contraseña
            </h1>

            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={bruja}
                alt="image description"
            />

            {tokenback && (
                <form className="w-80" onSubmit={handleSubmit(changePassword)}>
                    <div className="mb-1">
                        {/* Campo de nueva contraseña con ojo */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa tu nueva contraseña"
                                className="block w-full rounded-md border border-gray-300 focus:border-[#20B2AA] focus:outline-none focus:ring-1 focus:ring-[#20B2AA] py-1 px-1.5 text-gray-500"
                                style={inputStyle}
                                {...register("password", { 
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 14,
                                        message: "La contraseña debe tener al menos 14 caracteres"
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" />
                                        <path d="M1 1l22 22" />
                                        <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-800" style={errorStyle}>
                                {errors.password?.type === "required"
                                    ? "La contraseña es obligatoria"
                                    : errors.password?.type === "minLength"
                                    ? errors.password.message
                                    : ""}
                            </p>
                        )}

                        {/* Campo de repetir contraseña con ojo */}
                        <div className="relative mt-2">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repite tu contraseña"
                                className="block w-full rounded-md border border-gray-300 focus:border-[#20B2AA] focus:outline-none focus:ring-1 focus:ring-[#20B2AA] py-1 px-1.5 text-gray-500"
                                style={inputStyle}
                                {...register("confirmpassword", { required: "La confirmación es obligatoria" })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" />
                                        <path d="M1 1l22 22" />
                                        <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmpassword && (
                            <p className="text-red-800" style={errorStyle}>
                                {errors.confirmpassword.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <button
                            className="bg-black text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white"
                            style={{ fontSize: '14px', marginTop: '15px' }}
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Reset;

const inputStyle = {
    marginTop: '10px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#eeeeee',
    fontSize: '15px',
};

const errorStyle = {
    color: 'red',
    fontSize: '0.7rem',
    marginTop: '10px',
    marginBottom: '1px',
    marginLeft: '20px'
    
};


const letraStyle = {
  fontFamily: "Gowun Batang, serif"
};
