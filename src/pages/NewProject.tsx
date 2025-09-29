import { useForm } from "react-hook-form";
import EditorNavbar from "../components/EditorNavbar";
import { bookCategories } from "../utils";
import type { StoryRequest, StoryResponse } from "../types/types";
import { useCreateStoryMutation } from "../services/storyApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootSatate } from "../store/store";
import { s3Api, useGetProfileImagePresignedQuery } from "../services/s3Api";

function NewProject() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryRequest>();

  const user = useSelector((state: RootSatate) => state.auth.user)
  const [createStory] = useCreateStoryMutation()
  const [storyPicture, setStoryPicture] = useState<string | null>(user?.picture! || null)
  const [selectFile, setSelectFile] = useState<File | null>(null)
  const navigate = useNavigate()
  const [uploadImagePresigned] = s3Api.useLazyUploadImagePresignedQuery();
  const isFromS3 = user?.picture?.includes("s3.amazonaws.com") || !user?.picture?.startsWith("http");

  
  const { data, isSuccess } = useGetProfileImagePresignedQuery(user?.picture!, {
    skip: !isFromS3,
  });


  useEffect(() => {
    if (!user?.picture) return;

    if (isFromS3) {
      if (isSuccess && data) {
        setStoryPicture(data.url);
      } else {
        setStoryPicture("image.png");
      }
    } else {
      setStoryPicture(user.picture);
    }
  }, [isFromS3, isSuccess, data, user?.picture]);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectFile(file)
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoryPicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (dataForm: StoryRequest) => {
    let picture = storyPicture
    try {

      if (isFromS3) {
        const { uploadUrl, publicUrl } = await uploadImagePresigned({
          filename: `profiles/${user?.id}-${user?.nickname}-${selectFile?.name}`,
          contentType: selectFile?.type!,
        }).unwrap()
        const url = new URL(publicUrl);
        const key = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;
        console.log(key)

        const res = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": selectFile?.type! },
          body: selectFile
        })
        console.log(res)
        picture = key
      }
      // 
      const data: StoryRequest = {
        title: dataForm.title,
        description: dataForm.description,
        genre: dataForm.genre,
        coverImageUrl : picture!,
        visibility: 'private',
        status: 'in_progress',
      }

      const newStory: StoryResponse = await createStory(data).unwrap()

      console.log("data", data)

      navigate(`/editor/${newStory.id}`)
    } catch (error) {

    }
  };

  return (
    <div>
      <EditorNavbar title="historia sin titulo" />
      <div className="flex flex-row w-full h-screen bg-white">
        {/* Columna izquierda: Imagen y botón */}
        <div className="w-1/3 flex flex-col items-center justify-start pt-10 px-6">
          <p className="block text-gray-700 font-medium">Portada</p>
          <div className="flex items-center justify-center relative w-[250px] h-[350px] shadow-lg rounded overflow-hidden">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-[250px] h-[350px]  rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100  ">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img
                  src={storyPicture!}
                  alt="Portada"
                  className="object-cover w-full h-full"
                />

              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* <div className="relative w-[250px] h-[350px] shadow-lg rounded overflow-hidden">
            <img
              src="URL_DE_LA_IMAGEN"
              alt="Portada"
              className="object-cover w-full h-full"
            />
             
            <button className="absolute bottom-2 left-2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full shadow-md">
              <i className="pi pi-pencil" />
            </button>
          </div>

          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow">
            Vista previa
          </button> */}
        </div>

        {/* Columna derecha: Formulario */}
        <div className="w-2/3 p-10">
          <div className="border-b mb-6">
            <nav className="flex space-x-6 text-gray-600 font-medium">
              <span className="text-orange-500 border-b-2 border-orange-500 pb-2 cursor-pointer">
                Detalles de la historia
              </span>
            </nav>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-medium">Título</label>
              <input
                {...register("title", { required: "Este campo es requerido" })}
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 font-medium flex items-center gap-1">
                Descripción
              </label>
              <textarea
                {...register("description", {
                  required: "Este campo es requerido",
                })}
                className="w-full border rounded px-4 py-2 mt-1 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-700 font-medium flex items-center gap-1">
                Categoría <i className="pi pi-info-circle text-gray-400" />
              </label>
              <select
                {...register("genre", { required: "Selecciona una categoría" })}
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Selecciona una categoría</option>
                {bookCategories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
              onClick={handleSubmit(onSubmit)}
            >
              Crear historia
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewProject;
