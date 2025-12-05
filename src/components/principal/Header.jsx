import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import storeProfile from "../../context/storeProfile";

export const Header = () => {
  const user = storeProfile((state) => state.user);
  const clearUser = storeProfile((state) => state.clearUser);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogin = () => {
    navigate("/login");
    window.location.reload();
  };

  const handleRegister = () => {
    navigate("/register");
    window.location.reload();
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("auth-token");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <header
      className="bg-[#0F111A] text-white font-medium flex justify-between items-center px-6 sm:px-12 h-12
                 shadow-sm z-50"
      style={{ fontFamily: "Gowun Batang, serif" }}
    >
      {/* Logo */}
      <NavLink
        to={isLoggedIn ? "/dashboard/home" : "/"}
        className="flex items-center gap-3"
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-auto"
        />
        <span className="font-semibold text-lg text-[#20B2AA]">
          Jezt
        </span>
      </NavLink>

      {/* Botones de sesión */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="px-2 py-1 md:px-4 md:py-0.5 rounded-md text-white font-medium text-xs md:text-sm bg-[#EF3340] hover:bg-[#e73b3b] transition-colors duration-200"
            >
              Salir
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-2 py-1 md:px-4 md:py-0.5 rounded-md text-white font-medium text-xs md:text-sm bg-[#20B2AA] hover:bg-[#1aa298] transition-colors duration-200"
            >
              Panel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="px-2 py-1 md:px-4 md:py-0.5 rounded-md text-white font-medium text-xs md:text-sm bg-[#20B2AA] hover:bg-[#1aa298] transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={handleRegister}
              className="px-2 py-1 md:px-4 md:py-0.5 rounded-md text-white font-medium text-xs md:text-sm bg-[#EF3340] hover:bg-[#e73b3b] transition-colors duration-200"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
