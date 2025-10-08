import { useEffect, useRef, useState } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import type { ChapterResponse, PageResponse, TextCell } from '../types/types';
import { groupCellsIntoPages } from '../utils/paginationUtils';
import { s3Api } from '../services/s3Api';
import { CellRenderer } from './CellRenderer';

import { useCreateChapterMutation, useUpdateChapterMutation } from '../services/chapterApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStoryByIdQuery } from '../services/storyApi';
import StoryPreview from '../pages/storys/StoryPreview';
import EditorCell from './EditorCell';


type FormEditorPageProps = {
  initialTitle?: string;
  initialCells?: TextCell[];
  IdChapter?: number;
  onSubmit: (pages: { pageNumber: number; content: string, id?: number }[], chapterId: number) => Promise<PageResponse[]>;
};

export default function FormEditorPage({
  initialTitle = 'Parte 1',
  initialCells = [],
  IdChapter,
  onSubmit,
}: FormEditorPageProps) {
  const [cells, setCells] = useState<TextCell[]>(initialCells);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle);

  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const editorRef = useRef<Record<string, Editor | null>>({});

  const [uploadImagePresigned] = s3Api.useLazyUploadImagePresignedQuery();

  const { idStory } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const { data: story } = useGetStoryByIdQuery(storyId!);
  const [chapterId, setCahpterId] = useState<number>(IdChapter! > 0 ? IdChapter! : 0)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [createChapter] = useCreateChapterMutation()
  const [updateChapter, { data: chapterUpdate }] = useUpdateChapterMutation()

  const [savedPages, setSavedPages] = useState<PageResponse[]>([]);


  useEffect(() => {
    setCells(prevCells => {
      const updated = savedPages.map(page => {
        const existing = prevCells.find(c => c.pageNumber === page.pageNumber);
        if (existing) {
          return {
            ...existing,
            pageId: page.id,
            content: page.content,
          };
        }
        return {
          id: crypto.randomUUID(),
          content: page.content,
          isEditing: false,
          pageId: page.id,
          pageNumber: page.pageNumber,
        };
      });
      return updated;
    });
  }, [savedPages]);



  useEffect(() => {
    if (initialCells.length > 0) {
      setCells(initialCells); // actualizar cells si cambian los chunks
      console.log(initialCells)
    }
  }, [initialCells]);



  useEffect(() => {
    if (!title.trim()) return; // Evita enviar si title está vacío


    const timeoutId = setTimeout(async () => {

      try {
        if (!chapterId) {
          // se crea el capitulo
          const newChapter: ChapterResponse = await createChapter({
            storyId,
            data: { title }
          }).unwrap();
          console.log("cahpter", newChapter)
          setCahpterId(newChapter.idChapter)
        } else {
          // se actualiza
          await updateChapter({ storyId, chapterId, data: { title } }).unwrap()
          console.log(chapterUpdate)
        }
      } catch (error) {
        console.error("Error en creación/actualización de capítulo", error);
      }
      console.log("cahpterId", chapterId)

    }, 1000); // espera 1000 ms (1 segundo)

    // Cleanup: si el título cambia antes de los 1000 ms, cancela el anterior
    return () => clearTimeout(timeoutId);
  }, [title]);



  const addCell = () => {
    const id = crypto.randomUUID();
    setCells((prev) =>
      prev.map((cell) => ({ ...cell, isEditing: false })).concat({
        id,
        content: '',
        isEditing: true,
      })
    );
    setEditingCellId(id);

    setTimeout(() => {
      const el = cellRefs.current[id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const editorInstance = editorRef.current[id];
      if (editorInstance) {
        const editableDiv = editorInstance.getQuill().root;
        editableDiv.focus();
      }
    }, 50);
  };

  const updateContent = (id: string, newContent: string) => {
    setCells((prev) =>
      prev.map((cell) =>
        cell.id === id ? { ...cell, content: newContent } : cell
      )
    );
  };

  const deleteCell = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setCells((prev) => prev.filter((cell) => cell.id !== id));
        if (editingCellId === id) setEditingCellId(null);
        Swal.fire('Eliminado', 'La línea ha sido eliminada.', 'success');
      }
    });
  };

  const handleSavePages = async () => {
    // Adaptamos el trigger a una función que devuelva lo esperado
    const getPresignedUrl = async ({ filename, contentType }: { filename: string; contentType: string }) => {
      const result = await uploadImagePresigned({ filename, contentType }).unwrap();
      return result;
    };

    console.log("cells antes de groupCellsIntoPages", cells)
    const pages = await groupCellsIntoPages(cells, getPresignedUrl);


    console.log("pages despues de groupCellsIntoPages", pages)
    const saved = await onSubmit(
      pages.map((page) => ({
        pageNumber: page.number,
        content: page.cells.map((c) => c.content).join("\n"),
        id: page.id,
      })),
      chapterId!
    );
    setSavedPages(saved)


    Swal.fire(
      "¡Páginas preparadas!",
      `Se generaron ${pages.length} páginas.`,
      "success"
    );
  };




  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-40">
        <div>
          <label className="text-sm text-gray-500">{story?.title}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold w-full outline-none bg-transparent"
            placeholder="Nombre del documento"
          />
        </div>
        <div className="flex items-center gap-4">
          {
            !isPreview && (

              <div className=''>
                <button className="bg-gray-700 text-white hover:bg-gray-950 px-4 py-2 rounded-lg mr-4">
                  Publicar
                </button>
                <button
                  className="border border-black text-black px-4 py-2 rounded-lg"
                  onClick={handleSavePages}
                >
                  Guardar
                </button>
              </div>
            )
          }
          <button className="border border-black text-black px-4 py-2 rounded-lg " onClick={() => setIsPreview(prev => !prev)}>
            {isPreview ? "Seguir editando" : " Vista previa"}
          </button>
        </div>
      </div>

      {/* Editor */}
      {
        !isPreview ? (
          <EditorCell addCell={addCell} cells={cells} cellRefs={cellRefs} editingCellId={editingCellId} updateContent={updateContent}
            editorRef={editorRef} setEditingCellId={setEditingCellId} deleteCell={deleteCell} />

        ) : (
          <StoryPreview  cells={cells} />
        )
      }
    </div>
  );
}
