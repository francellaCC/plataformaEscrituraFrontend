import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import type { RootSatate } from '../store/store';
import { useGetStoryByIdQuery, useUpdateStoryMutation } from '../services/storyApi';
import type { StoryRequest } from '../types/types';
import StoryForm from './StoryForm';
import { convertStoryResponseToRequest } from '../utils/storyUtils';
import { s3Api, useGetProfileImagePresignedQuery } from '../services/s3Api';
import { Bounce, toast } from 'react-toastify';

export default function EditStory() {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get('idStory')
  const idStory = parseInt(storyId!)
  const user = useSelector((state: RootSatate) => state.auth.user);
  const [updateStory, { isLoading, isSuccess: isSuccessUpdate }] = useUpdateStoryMutation();
  const { data: story, isLoading: isLoadingStory } = useGetStoryByIdQuery(idStory!);

  const [storyPicture, setStoryPicture] = useState<string | null>(null);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [uploadImagePresigned] = s3Api.useLazyUploadImagePresignedQuery();
  const isFromS3 = story?.coverImageUrl?.includes("s3.amazonaws.com") || !story?.coverImageUrl?.startsWith("http");

  const { data, isSuccess } = useGetProfileImagePresignedQuery(story?.coverImageUrl!, {
    skip: !isFromS3,
  });

  useEffect(() => {
    if (!story?.coverImageUrl) return;

    if (isFromS3) {
      if (isSuccess && data) {
        setStoryPicture(data.url);
      } else {
        setStoryPicture("image.png");
      }
    } else {
      setStoryPicture(story?.coverImageUrl!);
    }
  }, [isFromS3, isSuccess, data, story?.coverImageUrl]);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoryPicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (dataForm: StoryRequest) => {
    let picture = storyPicture
    let key
    try {
      if (selectFile) {
        const { uploadUrl, publicUrl } = await uploadImagePresigned({
          filename: `storycoverImageUrl/${user?.id}-${user?.nickname}-${selectFile?.name}`,
          contentType: selectFile?.type!,
        }).unwrap()

        const url = new URL(publicUrl);
        key = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;

        console.log("key", key)
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": selectFile?.type! },
          body: selectFile
        })

       
      } else if (isFromS3) {
        const url = new URL(picture!);
        key = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;
        console.log(key)
      }

      const data: StoryRequest = {

        title: dataForm.title,
        description: dataForm.description,
        genre: dataForm.genre,
        coverImageUrl: key!,
        visibility: 'private',
        status: 'in_progress',
      }

      await updateStory({ id: idStory, data }).unwrap()
      if (isSuccessUpdate) {
        toast.success('Historia Actualizada Correctamente!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      console.log(dataForm)
    } catch (error) {
      console.error("Error updating story:", error)
    }
  };

  if (isLoadingStory) return <div>Cargando...</div>;

  return (
    <div>

      <StoryForm
        onSubmit={onSubmit}
        initialData={convertStoryResponseToRequest(story!)}
        storyPicture={storyPicture}
        onImageChange={handleImageChange}
        submitButtonText="Actualizar historia"
        isLoading={isLoading}
      />
    </div>
  );
}
