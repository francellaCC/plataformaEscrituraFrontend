import React from 'react'
import DropdownMenu from './DropdownMenu'
import { Link, useNavigate } from 'react-router-dom'
import type { StoryResponse } from '../types/types'
import { useSelector } from 'react-redux'
import type { RootSatate } from '../store/store'
import ProfilePicture from './ProfilePicture'
import { useDeleteStoryMutation } from '../services/storyApi'
import Swal from 'sweetalert2'

type StoryDetailsProps = {
  story: StoryResponse
}
export default function StoryDetails({ story }: StoryDetailsProps) {
  const user = useSelector((state: RootSatate) => state.auth.user)
  const image = story.coverImageUrl ?? user?.picture
  const [deleteStory] = useDeleteStoryMutation()
  const navigate = useNavigate()

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Eliminar historia?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          // 🔹 unwrap() funcionará aunque el backend devuelva 204 No Content
          await deleteStory(id).unwrap();
          // 🔹 Retornamos true solo para que Swal cierre el modal correctamente
          return true;
        } catch (error) {
          Swal.showValidationMessage(
             'No se pudo eliminar la historia'
          );
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La historia fue eliminada correctamente',
        });
      }
    });
  };


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
      label: "Eliminar Historia",
      onClick: () => handleDelete(+story.id),
      danger: true,
    }
  ]
  return (
    <div className="mt-8 ">
      <div className="flex  gap-5">
        <div className="w-40 h-52">
          <ProfilePicture picture={image} width='w-40' height='h-52' />
        </div>
        <div className="flex flex-row justify-between gap-52">
          <Link className="mt-2 font-semibold" to={`/storyEdit?tab=tabla&idStory=${story.id}`}>{story.title}</Link>
          <DropdownMenu options={menuOptions} />
        </div>
      </div>
    </div>
  )
}
