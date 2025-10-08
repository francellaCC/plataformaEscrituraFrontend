import { useParams } from 'react-router-dom';

import { useGetChapterByIdQuery } from '../../services/chapterApi';
import { useCreatePageMutation, useGetPagesByChapterIdQuery, useUpdatePageMutation } from '../../services/pageApi';

import type { ChapterResponse, PageResponse, TextCell } from '../../types/types';



import { useCallback, useEffect, useRef, useState } from 'react';
import FormEditorPage from '../../components/FormEditorPage';

export default function EditPageContent() {
  const { idStory, idCahpter } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const chapterId = idCahpter ? parseInt(idCahpter) : 0;
  const LIMIT = 3
  const [offset, setOffset] = useState(0)
  const [cells, setCells] = useState<TextCell[]>([]);
  const [totalPages, setTotalPages] = useState(0)


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
    IdChapter: ChapterResponse['idChapter']
  ) => {

    const responses: PageResponse[] = []
    for (const page of pages) {
      console.log(page)
      console.log(page.id)
      if (page.id) {
        const resesponse = await updatePage({
          storyId,
          chapterId: IdChapter!,
          pageId: page.id!,
          data: page,
        }).unwrap();
        responses.push(resesponse)
      } else {
        const resesponse = await createPage({
          storyId,
          chapterId: IdChapter!,
          data: page,
        }).unwrap();
        responses.push(resesponse)
      }
    }

    return responses
  };

  if (!chapterData) return <p>Cargando capítulo...</p>;

  return (
    <div >
      <FormEditorPage
        initialCells={cells}
        initialTitle={chapterData.title}
        IdChapter={chapterId}
        onSubmit={handleSubmit}
      />
      {/* Marcador invisible para el observer */}
      <div ref={lasPageRef} className="h-10"></div>
      {isFetching && <p className="text-center mt-4">Cargando más páginas...</p>}

    </div>


  );
}