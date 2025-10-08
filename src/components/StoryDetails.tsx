import React from 'react'
import DropdownMenu from './DropdownMenu'
import { Link, useNavigate } from 'react-router-dom'
import type { StoryResponse } from '../types/types'
import { useSelector } from 'react-redux'
import type { RootSatate } from '../store/store'
import ProfilePicture from './ProfilePicture'

type StoryDetailsProps = {
  story: StoryResponse
}
export default function StoryDetails({ story}: StoryDetailsProps) {
    const user = useSelector((state: RootSatate) => state.auth.user)
    const image = story.coverImageUrl ?? user?.picture
  const navigate = useNavigate()
  const menuOptions = [
    {
      label: "Ver ",
      onClick: () => navigate(`/stories/${story.id}/view`),
    },
    {
      label: "Editar ",
      onClick: () => navigate(`/storyEdit?tab=detalles&idStory=${story.id}`),

    },
    {
      label: "Eliminar esta Parte",
      onClick: () => console.log("Eliminar capítulo", story.id),
      danger: true,
    }
  ]
  return (
    <div className="mt-8 ">
      <div className="flex  gap-5">
        <div className="w-40 h-52">
         <ProfilePicture picture={image} width='w-40' height='h-52'/>
        </div>
        <div className="flex flex-row justify-between gap-52">
          <Link className="mt-2 font-semibold" to={`/storyEdit?tab=tabla&idStory=${story.id}`}>{story.title}</Link>
          <DropdownMenu options={menuOptions} />
        </div>
      </div>
    </div>
  )
}
