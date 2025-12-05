import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiMessageCircle, FiCpu, FiFileText, FiSmartphone, FiUser } from "react-icons/fi";
import Footer from "../components/principal/Footer";
import Header from "../components/principal/Header";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Verificar si existe token en localStorage
    const AUTH = localStorage.getItem("auth-token");
    const token = AUTH ? JSON.parse(AUTH).state.token : null;
    setIsLogged(!!token);

    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-in-out-back'
    });
  }, []);

  return (
    <>
      <Header />
      <section className="relative bg-[#17243D]" style={{ fontFamily: 'Gowun Batang, serif' }}>

        {/* === Header con imagen y texto épico === */}
        <div className="w-full h-[500px] sm:h-[600px] border-l-[5mm] border-r-[5mm] border-b-[5mm] border-[#17243D] relative overflow-hidden">
          <img src={'/fondo-forgot.jpeg'} alt="Encabezado" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-transparent via-gray-900/40 to-gray-900/60 opacity-70"></div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <h1
              className="text-white text-5xl sm:text-7xl font-extrabold mb-4"
              data-aos="zoom-in"
              style={{
                textShadow: `
                  0 0 5px #20b2aa,
                  0 0 10px #20b2aa,
                  0 0 20px #20b2aa,
                  0 0 30px rgba(0, 0, 0, 0.8),
                  0 0 40px rgba(0, 0, 0, 0.7)
                `,
                transform: 'scale(1)',
                transition: 'transform 0.7s ease-in-out'
              }}
            >
              JEZT IA
            </h1>
            <p
              className="text-white text-sm sm:text-lg font-bold mb-3 tracking-widest uppercase opacity-100"
              data-aos="fade-right"
              data-aos-delay="100"
              style={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.9)' }}
            >
              Innovación | Aprendizaje | Eficiencia
            </p>
            <hr className="w-24 mx-auto border-t-2 mb-3 rounded-full" style={{ borderColor: '#20b2aa' }} />
            <p
              className="text-white text-base sm:text-lg max-w-xl opacity-100 font-medium"
              data-aos="fade-left"
              data-aos-delay="200"
              style={{ textShadow: '0 0 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.7)' }}
            >
              Recibe información importante, resuelve tus dudas y realiza un seguimiento de tus procesos académicos desde cualquier dispositivo.
            </p>
          </div>
        </div>

        {/* === Sección Funcionalidades principales con efectos épicos === */}
        <section className="bg-white py-20 px-6 sm:px-16 relative overflow-hidden">
          {/* Líneas decorativas generales */}
          <div className="absolute top-0 left-1/2 w-[2px] h-full  -translate-x-1/2"></div>
          <div className="absolute top-1/3 left-0 w-full h-[2px] "></div>
          <div className="absolute bottom-1/3 right-0 w-full h-[2px] "></div>
          <div className="absolute top-1/4 left-1/4 w-[2px] h-1/2  rotate-12"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[2px] h-1/2  -rotate-12"></div>

          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-800">
              Funcionalidades principales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre cómo nuestro sistema de mensajería automatizada y Chatbot con IA ayuda a los estudiantes de la ESFOT 
              a mantenerse informados, resolver dudas y realizar trámites de manera eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Card 1 */}
            <div 
              className="flex flex-col items-center text-center p-6 border rounded-xl shadow-md hover:shadow-xl transition-all duration-700"
              data-aos="fade-right" 
              data-aos-delay="100"
            >
              <FiMessageCircle className="text-[#20b2aa] w-12 h-12 mb-4 hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Mensajería inmediata</h3>
              <hr className="w-12 border-t-2 border-[#20b2aa] mb-2 rounded-full" />
              <p className="text-gray-600 text-sm">
                Recibe notificaciones importantes sobre trámites, eventos y  actividades académicas en tiempo real.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              className="flex flex-col items-center text-center p-6 border rounded-xl shadow-md hover:shadow-xl transition-all duration-700"
              data-aos="fade-left" 
              data-aos-delay="200"
            >
              <FiCpu className="text-[#20b2aa] w-12 h-12 mb-4 hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Resuelve tus dudas al instante</h3>
              <hr className="w-12 border-t-2 border-[#20b2aa] mb-2 rounded-full" />
              <p className="text-gray-600 text-sm">
                Interactúa con nuestro Chatbot inteligente y obtén comunicados de divulgación de actividades administrativas, académicas y extracurriculares.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              className="flex flex-col items-center text-center p-6 border rounded-xl shadow-md hover:shadow-xl transition-all duration-700"
              data-aos="flip-left" 
              data-aos-delay="300"
            >
              <FiFileText className="text-[#20b2aa] w-12 h-12 mb-4 hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Organización de prácticas y trámites</h3>
              <hr className="w-12 border-t-2 border-[#20b2aa] mb-2 rounded-full" />
              <p className="text-gray-600 text-sm">
                Consulta y realiza un seguimiento de tus formularios de prácticas pre profesionales y de servicio comunitario de manera sencilla.
              </p>
            </div>

            {/* Card 4 */}
            <div 
              className="flex flex-col items-center text-center p-6 border rounded-xl shadow-md hover:shadow-xl transition-all duration-700"
              data-aos="flip-right" 
              data-aos-delay="400"
            >
              <FiSmartphone className="text-[#20b2aa] w-12 h-12 mb-4 hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Disponible en todos tus dispositivos</h3>
              <hr className="w-12 border-t-2 border-[#20b2aa] mb-2 rounded-full" />
              <p className="text-gray-600 text-sm">
                Accede desde cualquier computadora, tablet o móvil con una interfaz fácil de usar y completamente responsiva.
              </p>
            </div>
          </div>
        </section>

        {/* === Sección Cómo funciona / Workflow Dinámico con efectos épicos === */}
        <section className="bg-[#17243D] py-20 px-6 sm:px-16 overflow-x-hidden relative">
          {/* Patrón de líneas diagonales de fondo */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 20px),
                                repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 20px)`
            }}
          ></div>

          <div className="text-center mb-12 relative z-10" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
              Cómo funciona
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Nuestro sistema combina mensajería automatizada, IA y flujos de trabajo organizados 
              para que nunca pierdas información y agilices tus procesos académicos.
            </p>
          </div>

          <div className="flex flex-col space-y-12 relative z-10">
            {/* Paso 1 - Izquierda */}
            <div className="w-full flex justify-start px-4 sm:px-80" data-aos="fade-right" data-aos-delay="100">
              <div className="flex items-center gap-6 w-full sm:max-w-2xl relative">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#20b2aa] text-white text-2xl font-bold">
                  1
                </div>
                <div className="bg-white/10 p-6 rounded-xl w-full">
                  <h3 className="text-white font-bold text-lg mb-2">Registro y acceso</h3>
                  <hr className="border-t-2 border-[#20b2aa] w-16 mb-2 rounded-full" />
                  <p className="text-gray-300 text-sm">
                    Crea tu cuenta y accede al sistema de forma segura y rápida.
                  </p>
                </div>
                <div className="absolute top-0 left-8 h-full border-l-2 border-[#20b2aa]/20"></div>
              </div>
            </div>

            {/* Paso 2 - Derecha */}
            <div className="w-full flex justify-end px-4 sm:px-80" data-aos="fade-left" data-aos-delay="200">
              <div className="flex items-center gap-6 w-full sm:max-w-2xl relative">
                <div className="bg-white/10 p-6 rounded-xl w-full">
                  <h3 className="text-white font-bold text-lg mb-2">Mensajes y notificaciones</h3>
                  <hr className="border-t-2 border-[#20b2aa] w-16 mb-2 rounded-full" />
                  <p className="text-gray-300 text-sm">
                    Recibe información importante sobre actividades académicas, administrativas, extracurriculares y resuelve tus dudas desde cualquier dispositivo.
                  </p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#20b2aa] text-white text-2xl font-bold">
                  2
                </div>
                <div className="absolute top-0 right-8 h-full border-r-2 border-[#20b2aa]/20"></div>
              </div>
            </div>

            {/* Paso 3 - Izquierda */}
            <div className="w-full flex justify-start px-4 sm:px-80" data-aos="fade-right" data-aos-delay="300">
              <div className="flex items-center gap-6 w-full sm:max-w-2xl relative">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#20b2aa] text-white text-2xl font-bold">
                  3
                </div>
                <div className="bg-white/10 p-6 rounded-xl w-full">
                  <h3 className="text-white font-bold text-lg mb-2">Consulta al Chatbot IA</h3>
                  <hr className="border-t-2 border-[#20b2aa] w-16 mb-2 rounded-full" />
                  <p className="text-gray-300 text-sm">
                    Resuelve tus dudas al instante con un chat potenciado con IA.
                  </p>
                </div>
                <div className="absolute top-0 left-8 h-full border-l-2 border-[#20b2aa]/20"></div>
              </div>
            </div>

            {/* Paso 4 - Derecha */}
            <div className="w-full flex justify-end px-4 sm:px-80" data-aos="fade-left" data-aos-delay="400">
              <div className="flex items-center gap-6 w-full sm:max-w-2xl relative">
                <div className="bg-white/10 p-6 rounded-xl w-full">
                  <h3 className="text-white font-bold text-lg mb-2">Gestión de formularios</h3>
                  <hr className="border-t-2 border-[#20b2aa] w-16 mb-2 rounded-full" />
                  <p className="text-gray-300 text-sm">
                    Realiza un seguimiento de tus formularios (Practicas Pre-profesionales y Vinculación).
                  </p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#20b2aa] text-white text-2xl font-bold">
                  4
                </div>
                <div className="absolute top-0 right-8 h-full border-r-2 border-[#20b2aa]/20"></div>
              </div>
            </div>
          </div>
        </section>
        
        {isLogged && <Footer />}              
      </section>
    </>
  );
};export default Home;
