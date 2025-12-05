import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import storeProfile from '../context/storeProfile'
import { useEffect } from "react";

const Profile = () => {
    const { user } = storeProfile()


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
        <div className="w-full flex flex-col bg-white" style={inputStyle}>
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <h1 className='font-black text-4xl text-[#17243D]'>Perfil</h1>
                <hr className='my-4 border-t-2 border-[#17243D]' />
                <p className='mb-2 text-[#17243D]'>Información de la cuenta</p>
            </div>

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap px-4 sm:px-6 lg:px-8 pb-6'>
                <div className='w-full md:w-1/2'>
                    <FormProfile />
                </div>
                <div className='w-full md:w-1/2'>
                    <CardProfile />
                    <CardPassword />
                </div>
            </div>
        </div>
    )
}

// Mantiene tu diseño original
const inputStyle = {
  fontFamily: "Gowun Batang, serif",
};

export default Profile
