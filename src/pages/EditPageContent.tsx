import { useParams } from 'react-router-dom';

import { useGetChapterByIdQuery, useUpdateChapterMutation } from '../services/chapterApi';
import { useCreatePageMutation } from '../services/pageApi';

import type { TextCell } from '../types/types';
import type { ChapterWithPages } from '../types/types';
import FormEditorPage from '../components/FormEditorPage';
import { useGetStoryByIdQuery } from '../services/storyApi';

export default function EditPageContent() {
  const { idStory, idCahpter
  } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const chapterId = idCahpter
    ? parseInt(idCahpter
    ) : 0;

  const { data: story } = useGetStoryByIdQuery(storyId);

  const { data: chapterData } = useGetChapterByIdQuery({ storyId, chapterId });

  console.log(chapterData)
  // 🔹 Transformamos pages a TextCell[]
  const initialCells: TextCell[] =
    chapterData?.pages?.map((p) => ({
      id: crypto.randomUUID(),
      content: p.content,
      isEditing: false,
      pageId: p.id,              // id de la página backend
      pageNumber: p.pageNumber,
    })) ?? [];

  const handleSubmit = async (
    pages: { pageNumber: number; content: string, id?: number }[],
    title: string
  ) => {
    for (const page of pages) {
      if (page.id) {
        console.log("update")
      } else {
        console.log("new")
      }
    }

    // Guardar/actualizar páginas
    console.log(title, pages)

  };

  if (!chapterData) return <p>Cargando capítulo...</p>;

  return (
    <FormEditorPage
      storyTitle={story?.title}
      initialCells={initialCells}
      initialTitle={chapterData.title}
      onSubmit={handleSubmit}
    />
  );
}