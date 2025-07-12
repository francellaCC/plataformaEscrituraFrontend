import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [proyectos, setProyectos] = useState([])



  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Mis Proyectos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Tarjeta para crear nuevo */}
          <Link to="/editor/nuevo">
            <div className="border border-dashed border-neutral-400 rounded-2xl p-6 hover:bg-neutral-200 transition text-center cursor-pointer">
              <p className="text-neutral-500 text-xl">+ Nuevo Proyecto</p>
            </div>
          </Link>

          {/* Lista de proyectos */}
      
          
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
                <h2 className="text-lg font-medium text-neutral-800 mb-1">name</h2>
                <p className="text-sm text-neutral-500 line-clamp-2">sinopsis</p>
              </div>
           
        
        </div>
      </div>
    </div>
  )
}

export default Home
