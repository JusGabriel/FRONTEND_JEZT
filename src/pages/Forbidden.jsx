import logoDog from '../assets/logo.png'
import { useEffect } from 'react';

export const Forbidden = () => {

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


        <div className="flex flex-col items-center justify-center" style={inputStyle}>

            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src={logoDog} alt="image description" />

            <div className="flex flex-col items-center justify-center">

                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Page Not Allowed</p>

                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Sorry, you are not allowed to access this page.</p>


            </div>
        </div>
    )
}

// Mantiene tu diseño original
const inputStyle = {
  fontFamily: "Gowun Batang, serif",
};


