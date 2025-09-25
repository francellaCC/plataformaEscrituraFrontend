import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootSatate } from "../store/store";
import { useGetUserStoriesQuery } from "../services/storyApi";
import { useMemo, useState } from "react";
import StoryDetails from "../components/StoryDetails";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ProfileConfigModal from "../components/ConfigUserPerfil";
import { useGetProfileQuery, useUpdatePerfileMutation } from "../services/authApi";
import type { UserRequest } from "../types/types";
import ProfilePicture from "../components/ProfilePicture";

export default function UserProfile() {

  const [open, setOpen] = useState<boolean>(false)
  const {data: userDb, isLoading } = useGetProfileQuery()
  const { data: stories = []} = useGetUserStoriesQuery();
  const user = useSelector((state: RootSatate) => state.auth.user)
  const drafStories = useMemo(() => { return stories.filter(story => story.status === "in_progress").length }, [stories])
  const [updatePerfile] = useUpdatePerfileMutation()
  console.log(user)
  const navigate = useNavigate()

  const handleSave = async (data: UserRequest) => {
    console.log("Datos guardados:", data);
    await updatePerfile(data).unwrap()
   
  };

  if(isLoading) return "Cargando el perfil"
  return (
    <div className="min-h-screen relative">
      <div className="absolute right-64" >
        <button onClick={() => setOpen(true)} className="p-2 border flex gap-1 cursor-pointer " type="button">
          <PencilSquareIcon className="h-6 w-6 text-gray-500" /> Editar perfil
        </button>
      </div>
      <div className="flex items-center flex-col">
        <div >
          <ProfilePicture picture={userDb?.picture!} />
        </div>

        <p>{userDb?.name}</p>
        <p>@{userDb?.nickname}</p>

        <div className=" flex  flex-row gap-4">
          <p>0 Obras</p>
          <p>0 seguidos</p>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-row justify-center gap-10 mt-32">
        {/* card descripcion del profile */}

        {/* card de historias creadas*/}
        <div className="bg-white shadow-lg w-[600px]  p-4 rounded-lg h-auto">
          <div className="flex flex-row justify-between">
            <div>
              <h2 className="text-lg font-semibold">Historias de nombre del usario</h2>
              <p className="text-sm font-light text-gray-900">0 Historias publicadas {drafStories} Borradores (solo visible para ti)</p>
            </div>

            <span className="material-symbols-outlined ">
              settings
            </span>
          </div>
          {
            stories?.length > 0 ? (
              stories?.map(story => (
                <div className="mt-8 " key={story.id}>
                  <StoryDetails story={story} picture={userDb?.picture!} />
                </div>
              ))
            ) : (
              <div className=" p-6 text-center ">
                <button className="bg-orange-500 hover:bg-orange-600  text-white px-4 py-2 rounded mt-5" onClick={() => navigate("/newProject")}>
                  + Nuevo Proyecto
                </button>
              </div>
            )
          }

        </div>
      </div>

      {
        open && (
          <ProfileConfigModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSave={handleSave}
            initialData={userDb}
          />
        )
      }
    </div>
  )
}
