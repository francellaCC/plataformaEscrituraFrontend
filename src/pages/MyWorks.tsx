import { useState } from 'react'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'

function MyWorks() {
  const [proyectos, setProyectos] = useState([])


const navigate = useNavigate()
  return (
    <>
    <NavBar/>
      <div className="min-h-screen bg-neutral-100 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Mis Proyectos</h1>

          <div className="grid  sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Tarjeta para crear nuevo */}
            <div className=" w-[700px] h-[200px] border border-dashed border-neutral-400 rounded-2xl p-6 text-center ">
              <p className="text-neutral-500 text-3xl pb-4 mt-7">Hola, aun no tienes un proyecto creado</p>
              <button className="bg-orange-500 hover:bg-orange-600  text-white px-4 py-2 rounded" onClick={()=>navigate("/newProject")}>
                + Nuevo Proyecto
              </button>
            </div>



          </div>
        </div>
      </div>
    </>
  )
}

export default MyWorks
