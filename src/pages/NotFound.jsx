import logoNo from '../assets/logo.png';
import { Link } from 'react-router';
import { useEffect } from 'react';


export const NotFound = () => {
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
        <div className="flex flex-col items-center justify-center h-screen" style={inputStyle}>
            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={logoNo}
                alt="image description"
            />

            <div className="flex flex-col items-center justify-center text-center mt-12">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800">Página no encontrada</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">lo sentimos mucho</p>
                <Link to="/" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">
                    Regresar
                </Link>
            </div>
        </div>
    );
};

// Mantiene tu diseño original
const inputStyle = {
  fontFamily: "Gowun Batang, serif",
};
