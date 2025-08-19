import { useState } from 'react'
import DropdownMenu from '../components/DropdownMenu';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetAllChaptersQuery } from '../services/chapterApi';

export default function StoryEditor() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tab = searchParams.get("tab") || "detalles";
  const [activeTab, setActiveTab] = useState(tab);

  const storyId = searchParams.get('idStory')
  const idStory = storyId ? parseInt(storyId) : 0;

  const { data: chapters = [] } = useGetAllChaptersQuery(idStory)

  console.log('chapters', chapters)
  const menuOptions = [
    {
      label: "Vista Previa",
      onClick: () => navigate(`/capitulo/${storyId}`),

    },
    {
      label: "Eliminar esta Parte",
      onClick: () => console.log("Eliminar capítulo", storyId),
      danger: true,
    }
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Nav */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("detalles")}
            className={`pb-2 text-sm font-medium ${activeTab === "detalles"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Detalles de la historia
          </button>
          <button
            onClick={() => setActiveTab("tabla")}
            className={`pb-2 text-sm font-medium ${activeTab === "tabla"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Tabla de Contenidos
          </button>
        </nav>
      </div>

      {/* Contenido */}
      {activeTab === "detalles" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Editar detalles</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Título
              </label>
              <input
                type="text"
                placeholder="Título de la historia"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                placeholder="Escribe una breve descripción..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Guardar
            </button>
          </form>
        </div>
      )}

      {activeTab === "tabla" && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className='flex flex-row justify-between'>
            <h2 className="text-lg font-semibold mb-4">Capítulos</h2>
            <button className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600" onClick={() => navigate(`/editor/${storyId}`)}>
              + Parte Nueva
            </button>
          </div>
          {
            chapters.map(chapter => (
              <div className="space-y-2 mb-4" key={chapter.idChapter}>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium"><Link to={`/editor/${idStory}/${chapter.idChapter}`}>{chapter.title}</Link></p>
                    <span className="text-xs text-gray-500">
                      Borrador {chapter.createdAt}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">

                    <DropdownMenu options={menuOptions} />
                  </div>

                </div>
              </div>
            ))
          }


        </div>
      )}
    </div>
  );
}
