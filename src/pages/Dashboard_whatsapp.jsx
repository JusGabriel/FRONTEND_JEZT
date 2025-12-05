import React, { useState , useEffect} from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import VisualizarMensaje from "../components/Sidebar/VisualizarMensaje";
import EnviarMensaje from "../components/Sidebar/EnviarMensaje";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const DashboardWhatsapp = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const handleMessageDeleted = (deletedId) => {
    if (selectedMessage?._id === deletedId) {
      setSelectedMessage(null);
    }
    setRefreshSidebar(prev => !prev);
  };

  return (
    <div className="flex w-full h-full bg-white text-[#17243D] overflow-hidden font-sans" style={{ fontFamily: "Gowun Batang, serif" }}>
      {/* SIDEBAR COLAPSABLE */}
      <div className={`${sidebarOpen ? "w-80" : "w-12 sm:w-20"} flex flex-col border-r border-gray-300 bg-[#f2f2f2] shadow-sm transition-all duration-300`}>
        
        {/* Header con toggle */}
        <div className={`relative flex flex-col p-3 border-b border-gray-800 text-white transition-all duration-300
          ${sidebarOpen ? 'bg-[#17243D] min-h-[50px]' : 'bg-transparent min-h-[50px]'}`}>

          <div className="relative flex items-center w-full">
            {sidebarOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 font-semibold text-white text-center text-lg">
                Mensajes
              </span>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`transition-colors ${sidebarOpen ? 'ml-auto text-gray-300 hover:text-white' : 'mx-auto text-[#17243D] hover:text-[#20B2AA]'}`}
              title={sidebarOpen ? "Cerrar historial" : "Abrir historial"}
            >
              {sidebarOpen ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
            </button>
          </div>
        </div>

        {/* SIDEBAR CONTENT */}
        <Sidebar
          onSelectMessage={setSelectedMessage}
          refresh={refreshSidebar}
          sidebarOpen={sidebarOpen}
          onMessageDeleted={handleMessageDeleted}
          selectedMessageId={selectedMessage?._id}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        {selectedMessage ? (
          <VisualizarMensaje
            mensaje={selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        ) : (
          <EnviarMensaje />
        )}
      </div>
    </div>
  );
};


export default DashboardWhatsapp;