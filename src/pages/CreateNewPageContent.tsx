import { useParams } from 'react-router-dom';
import { useCreateChapterMutation } from '../services/chapterApi';
import { useCreatePageMutation } from '../services/pageApi';
import { useGetStoryByIdQuery } from '../services/storyApi';
import FormEditorPage from '../components/FormEditorPage';
import type { ChapterResponse, PageResponse } from '../types/types';


export default function CreateNewPageContent() {
  const { idStory } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const { data: story } = useGetStoryByIdQuery(storyId);

  const [createChapter] = useCreateChapterMutation();
  const [createPage] = useCreatePageMutation();

  const handleSubmit = async (pages: { pageNumber: number; content: string , id?: number}[], chapterId : ChapterResponse['idChapter']) => {
    const responses : PageResponse[] = []

    for (const page of pages) {
      const response = await createPage({
        storyId,
        chapterId,
        data: page,
      }).unwrap();
      responses.push(response)
    }

    return responses
  };

  return (
    <FormEditorPage
    
      onSubmit={handleSubmit}
    />
  );
}
