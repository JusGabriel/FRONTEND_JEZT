import { useForm } from "react-hook-form"
import { ToastContainer} from 'react-toastify';
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";
import { useEffect, useState } from "react"

const CardPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const {user, updatePasswordProfile} = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (data) => {
        const response = await updatePasswordProfile(data, user._id)
        if (response) {
            setTimeout(() => {
                clearToken()
            }, 2000) 
        }
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


    return (
        <>
        <ToastContainer />
            <div className='mt-8' >
            </div>

            <form onSubmit={handleSubmit(updatePassword)} style = {{fontFamily: 'Gowun Batang, serif'}}>


                <div className="relative mb-5">
                    <label className="mb-2 block text-sm font-semibold text-[#17243D]">Contraseña actual</label>
                    <input
                        type={showCurrent ? "text" : "password"}
                        className="block w-full py-1 px-2 bg-[#dee2e6] rounded-lg text-[#000000] pr-10"
                        autoComplete="current-password"
                        {...register("presentpassword", { required: "La contraseña actual es obligatoria" })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrent((prev) => !prev)}
                        aria-label={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute top-9 right-3 bg-transparent border-none cursor-pointer p-0"
                        tabIndex={-1}
                    >
                        {showCurrent ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" /><path d="M1 1l22 22" /><path d="M9.88 9.88a3 3 0 014.24 4.24" /></svg>
                        )}
                    </button>
                    {errors.presentpassword && <p className="text-red-800">{errors.presentpassword.message}</p>}
                </div>

                <div className="relative mb-5">
                    <label className="mb-2 block text-sm font-semibold text-[#17243D]">Nueva contraseña</label>
                    <input
                        type={showNew ? "text" : "password"}
                        className="block w-full py-1 px-2 bg-[#dee2e6] rounded-lg text-[#000000] pr-10"
                        autoComplete="new-password"
                        {...register("newpassword", { 
                            required: "La nueva contraseña es obligatoria",
                            minLength: {
                                value: 14,
                                message: "La contraseña debe tener al menos 14 caracteres"
                            }
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNew((prev) => !prev)}
                        aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute top-9 right-3 bg-transparent border-none cursor-pointer p-0"
                        tabIndex={-1}
                    >
                        {showNew ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" /><path d="M1 1l22 22" /><path d="M9.88 9.88a3 3 0 014.24 4.24" /></svg>
                        )}
                    </button>
                    {errors.newpassword && (
                        <p className="text-red-800">
                            {errors.newpassword?.type === "required"
                                ? "La nueva contraseña es obligatoria"
                                : errors.newpassword?.type === "minLength"
                                ? errors.newpassword.message
                                : ""}
                        </p>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <input
                        type="submit"
                        className="flex items-center  bg-[#17243D] hover:bg-[#EF3340] text-white px-8 py-2 rounded-md  transition disabled:opacity-50"
                        value="Cambiar"
                    />
                </div>


            </form>
        </>
    )
}

export default CardPassword
