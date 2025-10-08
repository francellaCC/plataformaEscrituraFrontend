
import { useGetAllChaptersQuery, useGetChapterByIdQuery } from "../../services/chapterApi";
import { useGetPagesByChapterIdQuery } from "../../services/pageApi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { RootSatate } from "../../store/store";
import type { TextCell } from "../../types/types";
import StoryHeader from "../../components/storyReaderPage/StoryHeader";
import PageList from "../../components/storyReaderPage/PageList";
import ChapterNavigation from "../../components/storyReaderPage/ChapterNavigation";
import { useGetStoryByIdQuery, useGetStoryWithAuthorQuery } from "../../services/storyApi";
import AuthorInfo from "../../components/storyReaderPage/AuthorInfo";

export default function StoryReaderPage() {
  const user = useSelector((state: RootSatate) => state.auth.user);
  const { storyId } = useParams();
  const idStory = storyId ? parseInt(storyId) : 0;

 
  const {data : story} = useGetStoryWithAuthorQuery(idStory!)

console.log(story)
  // 🔹 Capítulos de la historia
  const { data: chapters = [] } = useGetAllChaptersQuery(idStory);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const currentChapter = chapters[currentChapterIndex];

  // 🔹 Páginas del capítulo actual
  const LIMIT = 3;
  const [offset, setOffset] = useState(0);
  const [cells, setCells] = useState<TextCell[]>([]);

  const { data: pageChunk, isFetching } = useGetPagesByChapterIdQuery(
    { storyId: idStory, chapterId: currentChapter?.idChapter, limit: LIMIT, offset },
    { skip: !currentChapter }
  );

  // 🔹 Actualizar celdas cuando se obtienen más páginas
  useEffect(() => {
    if (pageChunk?.pages) {
      const newCells = pageChunk.pages.map((page) => ({
        id: crypto.randomUUID(),
        content: page.content,
        isEditing: false,
        pageId: page.id,
        pageNumber: page.pageNumber,
      }));
      setCells((prev) => [...prev, ...newCells]);
    }
  }, [pageChunk]);

  // 🔹 Cambiar capítulo
  const handleSelectChapter = (idChapter: number) => {
    const index = chapters.findIndex((ch) => ch.idChapter === idChapter);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      setCells([]);
      setOffset(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCells([]);
      setOffset(0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
      setCells([]);
      setOffset(0);
    }
  };

  const hasMore = pageChunk?.total
    ? cells.length < pageChunk.total
    : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <StoryHeader user={user!}
        chapters={chapters}
        currentChapter={currentChapter?.idChapter || null}
        onSelect={handleSelectChapter}
      />

      <div className="max-w-3xl mx-auto py-10">


        {/* Lista de páginas */}
        <div className="flex flex-row gap-8">
          <div className="w-96 px-5  mt-20">
            <AuthorInfo story={story!} />
          </div>
          
            <PageList
            pages={cells}
            hasMore={hasMore}
            isFetching={isFetching}
            onLoadMore={() => setOffset((prev) => prev + LIMIT)}
            storyTitle={story?.title!}
            chapterTitle={currentChapter?.title}
          />
        
        </div>

        {/* Navegación de capítulos */}
        <ChapterNavigation
          onPrevious={handlePrevChapter}
          onNext={handleNextChapter}
          disablePrev={currentChapterIndex === 0}
          disableNext={currentChapterIndex === chapters.length - 1}
        />
      </div>
    </div>
  );
}
