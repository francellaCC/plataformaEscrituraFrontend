import { useParams } from 'react-router-dom';
import { useCreateChapterMutation } from '../services/chapterApi';
import { useCreatePageMutation } from '../services/pageApi';
import { useGetStoryByIdQuery } from '../services/storyApi';
import FormEditorPage from '../components/FormEditorPage';


export default function CreateNewPageContent() {
  const { idStory } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const { data: story } = useGetStoryByIdQuery(storyId);

  const [createChapter] = useCreateChapterMutation();
  const [createPage] = useCreatePageMutation();

  const handleSubmit = async (pages: { pageNumber: number; content: string }[], title: string) => {
    const newChapter = await createChapter({ storyId, data: { title } }).unwrap();

    for (const page of pages) {
      await createPage({
        storyId,
        chapterId: newChapter.idChapter,
        data: page,
      }).unwrap();
    }
  };

  return (
    <FormEditorPage
      storyTitle={story?.title}
      onSubmit={handleSubmit}
    />
  );
}
