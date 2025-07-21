
import EditorNavbar from "../components/EditorNavbar"
import { bookCategories, bookLanguaje } from "../utils"


function NewProject() {

  return (
    <div>
      < EditorNavbar title="historia sin titulo" />
      <div className="flex flex-row w-full h-screen bg-white">
        {/* Columna izquierda: Imagen y botón */}
        <div className="w-1/3 flex flex-col items-center justify-start pt-10 px-6">
          {/* Imagen */}
          <div className="relative w-[250px] h-[350px] shadow-lg rounded overflow-hidden">
            <img
              src="URL_DE_LA_IMAGEN"
              alt="Portada"
              className="object-cover w-full h-full"
            />
            <button className="absolute bottom-2 left-2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full shadow-md">
              <i className="pi pi-pencil" />
            </button>
          </div>

          {/* Botón Vista previa */}
          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow">
            Vista previa
          </button>
        </div>

        {/* Columna derecha: Formulario */}
        <div className="w-2/3 p-10">
          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-6 text-gray-600 font-medium">
              <span className="text-orange-500 border-b-2 border-orange-500 pb-2 cursor-pointer">Detalles de la historia</span>

            </nav>
          </div>

          {/* Formulario */}
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Título</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className=" text-gray-700 font-medium flex items-center gap-1">
                Descripción
              </label>
              <textarea
                className="w-full border rounded px-4 py-2 mt-1 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className=" text-gray-700 font-medium flex items-center gap-1">
                Categoría <i className="pi pi-info-circle text-gray-400" />
              </label>
              <select className="w-full border rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option defaultChecked>Selecciona una categoria</option>
                {
                  bookCategories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className=" text-gray-700 font-medium flex items-center gap-1">
                Idioma
              </label>
              <select className="w-full border rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option>Selecciona un idioma</option>
                {bookLanguaje.map((lan, index) => (
                  <option key={index} value={lan}>{lan}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default NewProject