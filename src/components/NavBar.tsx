import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootSatate } from "../store/store";
import ProfilePicture from "./ProfilePicture";
import { useNavigate } from "react-router-dom";


function NavBar() {

  const user = useSelector((state: RootSatate) => state.auth.user);
  const navigate = useNavigate()
 const [openWrite, setOpenWrite] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const writeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);


  // Cerrar dropdowns cuando hago clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        writeRef.current &&
        !writeRef.current.contains(event.target as Node)
      ) {
        setOpenWrite(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <span className="text-lg font-bold">Plataforma Escritura</span>
      </div>

      {/* Buscador */}
      <div className="flex items-center border rounded-lg px-3 py-1 w-96">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar..."
          className="ml-2 w-full outline-none text-sm"
        />
      </div>

      {/* Opciones de la derecha */}
      <div className="flex items-center gap-6 relative">
        {/* Dropdown Escribir */}
        <div className="relative" ref={writeRef}>
          <button
            onClick={() => setOpenWrite((prev) => !prev)}
            className="flex items-center gap-1 hover:text-orange-600 transition"
          >
            Escribir <ChevronDownIcon className="w-4 h-4" />
          </button>
          {openWrite && (
            <div className="absolute mt-2 right-0 bg-white border shadow-lg rounded-lg w-48">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={()=>navigate("/newProject")}>
                ✍️ Nueva historia
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={()=> navigate("/myworks")}>
                📚 Mis historias
              </button>
            </div>
          )}
        </div>

        {/* Dropdown Perfil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <ProfilePicture picture={user?.picture!} width="w-8"  height="h-8"/>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {openProfile && (
            <div className="absolute mt-2 right-0 bg-white border shadow-lg rounded-lg w-48">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={()=>navigate("/user/userProfile")}>
                👤 Ir al perfil
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default NavBar