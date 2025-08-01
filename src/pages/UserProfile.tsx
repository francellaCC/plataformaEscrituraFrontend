import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {

  const user = useSelector((state)=> state.auth.user)
  console.log(user)
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center flex-col">
        <div className=" w-48">
          <img className=" rounded-full" src={user.picture} />
        </div>

        <p>{user.name}</p>
        <p>@{user.nickname}</p>

        <div className=" flex  flex-row gap-4">
          <p>0 Obras</p>
          <p>0 seguidos</p>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-row justify-center gap-10 mt-32">
        {/* card descripcion del user */}
        <div>
          <div className="bg-white shadow-lg w-96 h-56 p-4 rounded-lg">
            <div className="mb-5">
              <p>Descripcion del user</p>
            </div>
            <p className="text-sm font-semibold">Se ha unido <span className="font-normal">marzo 2025,2025</span></p>
          </div>
        </div>
        {/* card de historias creadas*/}

        <div className="bg-white shadow-lg w-[600px]  p-4 rounded-lg h-auto">
          <div className="flex flex-row justify-between">
            <div>
              <h2 className="text-lg font-semibold">Historias de nombre del usario</h2>
              <p className="text-sm font-light text-gray-900">0 Historias publicadas 0 Borradores (solo visible para ti)</p>
            </div>

            <span className="material-symbols-outlined ">
              settings
            </span>
          </div>

          <div className=" p-6 text-center ">
            <button className="bg-orange-500 hover:bg-orange-600  text-white px-4 py-2 rounded mt-5" onClick={()=>navigate("/newProject")}>
              + Nuevo Proyecto
            </button>
          </div>

          {/* <div className="mt-8 ">
            <div className="flex  gap-5">
              <div className="w-40 h-52">
                <img className="w-40 h-52 blur-sm" src="/img/image.png" alt="portada del libro" />
              </div>
              <Link className="mt-2 font-semibold" to={''}>Nombre del proyecto</Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
