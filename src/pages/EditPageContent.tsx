import { useParams } from 'react-router-dom';

import { useGetChapterByIdQuery, useUpdateChapterMutation } from '../services/chapterApi';
import { useCreatePageMutation, useGetPagesByChapterIdQuery, useUpdatePageMutation } from '../services/pageApi';

import type { TextCell } from '../types/types';
import type { ChapterWithPages } from '../types/types';
import FormEditorPage from '../components/FormEditorPage';
import { useGetStoryByIdQuery } from '../services/storyApi';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function EditPageContent() {
  const { idStory, idCahpter } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const chapterId = idCahpter ? parseInt(idCahpter) : 0;
  const LIMIT = 3
  const [offset, setOffset] = useState(0)
  const [cells, setCells] = useState<TextCell[]>([]);
  const [totalPages, setTotalPages] = useState(0)

  const { data: story } = useGetStoryByIdQuery(storyId);

  const { data: chapterData } = useGetChapterByIdQuery({ storyId, chapterId });

  const { data: pageChunk, isFetching } = useGetPagesByChapterIdQuery({ storyId, chapterId, limit: LIMIT, offset }, { skip: !storyId || !chapterId })
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation()

  useEffect(() => {
    if (pageChunk?.pages) {
      const newCell: TextCell[] = pageChunk?.pages.map(page => ({
        id: crypto.randomUUID(),
        content: page.content,
        isEditing: false,
        pageId: page.id,
        pageNumber: page.pageNumber
      }))
      setCells((prev) => [...prev, ...newCell])
      setTotalPages(pageChunk.total)
    }
  }, [pageChunk])


  //intersectionObserver para hacer el lazy load
  const observRef = useRef<IntersectionObserver | null>(null)
  const lasPageRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return

    if (observRef.current) observRef.current.disconnect()
    observRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (cells.length < totalPages) {
          setOffset((prev) => prev + LIMIT)
        }

      }
    });

    if (node) observRef.current.observe(node)

  }, [isFetching, cells.length, totalPages])

  const handleSubmit = async (
    pages: { pageNumber: number; content: string, id?: number }[],
    title: string
  ) => {
    for (const page of pages) {
      if (page.id) {
      
          await updatePage({
            storyId,
            chapterId: chapterData?.idChapter!,
            pageId: page.id!,
            data: page,
          }).unwrap();
        
      } else {
        
          await createPage({
            storyId,
            chapterId: chapterData?.idChapter!,
            data: page,
          }).unwrap();
        
      }
    }

    // Guardar/actualizar páginas
    console.log(title, pages)

  };

  if (!chapterData) return <p>Cargando capítulo...</p>;

  return (
    <div >
      <FormEditorPage
        storyTitle={story?.title}
        initialCells={cells}
        initialTitle={chapterData.title}
        onSubmit={handleSubmit}
      />
      {/* Marcador invisible para el observer */}
      <div ref={lasPageRef} className="h-10"></div>
      {isFetching && <p className="text-center mt-4">Cargando más páginas...</p>}

    </div>


  );
}