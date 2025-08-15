import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootSatate } from "../store/store";
import { useGetUserStoriesQuery } from "../services/storyApi";
import { useMemo } from "react";
import StoryDetails from "../components/StoryDetails";

export default function UserProfile() {

  const { data: stories = [], isLoading, error } = useGetUserStoriesQuery();
  const user = useSelector((state: RootSatate) => state.auth.user)
  const drafStories = useMemo(() => { return stories.filter(story => story.status === "in_progress").length }, [stories])
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
                  <StoryDetails story={story} picture={user.picture}/>
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
    </div>
  )
}
