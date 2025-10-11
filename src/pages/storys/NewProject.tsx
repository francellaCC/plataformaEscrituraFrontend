import { useForm } from "react-hook-form";
import EditorNavbar from "../../components/EditorNavbar";
import { bookCategories } from "../../utils";
import type { StoryRequest, StoryResponse } from "../../types/types";
import { useCreateStoryMutation } from "../../services/storyApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootSatate } from "../../store/store";
import { s3Api, useGetProfileImagePresignedQuery } from "../../services/s3Api";
import StoryForm from "../../components/StoryForm";

function NewProject() {

  const navigate = useNavigate()
  const user = useSelector((state: RootSatate) => state.auth.user)
  const [createStory, { isLoading }] = useCreateStoryMutation()
  const [storyPicture, setStoryPicture] = useState<string | null>(user?.picture! || null)
  const [selectFile, setSelectFile] = useState<File | null>(null)
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
        // await fetch(uploadUrl, {
        //   method: "PUT",
        //   headers: { "Content-Type": selectFile?.type! },
        //   body: selectFile
        // })

     
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

      const newStory: StoryResponse = await createStory(data).unwrap()
      navigate(`/editor/${newStory.id}`)
    } catch (error) {
      console.error("Error creating story:", error)
    }
  };

  return (
    <div>
      <EditorNavbar title="historia sin titulo" />
      <StoryForm
        onSubmit={onSubmit}
        storyPicture={storyPicture}
        onImageChange={handleImageChange}
        submitButtonText="Crear historia"
        isLoading={isLoading}
      />
    </div>
  );
}

export default NewProject;
