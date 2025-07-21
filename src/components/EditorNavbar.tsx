import { useNavigate } from "react-router-dom";

const EditorNavbar = ({ title }: { title: string }) => {

  const navigate = useNavigate()
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
      {/* Lado izquierdo: Back + Título */}
      <div className="flex items-center gap-2">
        <button onClick={()=> navigate("/")} className="text-gray-600 hover:text-black">
          <i className="pi pi-angle-left text-xl" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400"> Detalles de la Historia</span>
          <span className="font-semibold text-lg truncate max-w-[200px]">{title}</span>
        </div>
      </div>

      {/* Lado derecho: Botones */}
      <div className="flex items-center gap-4">
        <button onClick={()=> navigate("/")}  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
          Cancelar
        </button>
        <button onClick={()=> navigate("/editor")}   className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </div>
    </header>
  );
};

export default EditorNavbar;
