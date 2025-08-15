import React from 'react'
import DropdownMenu from './DropdownMenu'
import { Link, useNavigate } from 'react-router-dom'
import type { StoryResponse, User } from '../types/types'

type StoryDetailsProps = {
  story: StoryResponse,
  picture : User['picture']
}
export default function StoryDetails({ story, picture } : StoryDetailsProps ) {
   const navigate = useNavigate()
  const menuOptions = [
    {
      label: "Editar ",
      onClick: () => navigate(`/storyEdit?tab=detalles&idStory=${story.id}`),

    },
    {
      label: "Eliminar esta Parte",
      onClick: () => console.log("Eliminar capítulo",story.id),
      danger: true,
    }
  ]
  return (
    <div className="mt-8 ">
      <div className="flex  gap-5">
        <div className="w-40 h-52">
          <img className="w-40 h-52 blur-sm" src={picture!} alt="portada del libro" />
        </div>
        <div className="flex flex-row justify-between gap-52">
          <Link className="mt-2 font-semibold" to={`/storyEdit?tab=tabla&idStory=${story.id}`}>{story.title}</Link>
          <DropdownMenu options={menuOptions} />
        </div>
      </div>
    </div>
  )
}
