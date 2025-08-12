import { useEffect, useRef, useState } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useGetStoryByIdQuery } from '../services/storyApi';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useCreateChapterMutation, useUpdateChapterMutation } from '../services/chapterApi';
import type { ChapterResponse, TextCell } from '../types/types';
import { groupCellsIntoPages } from '../utils/paginationUtils';




const BookEditor = () => {
  const [cells, setCells] = useState<TextCell[]>([]);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [title, setTitle] = useState('Parte 1');

  const { idStory } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const { data: story } = useGetStoryByIdQuery(storyId!);
  const [createChapter] = useCreateChapterMutation()
  const [updateChapter, { data: chapterUpdate }] = useUpdateChapterMutation()
  const [chapterId, setCahpterId] = useState<number>()

  // Se accede al nodo DOM de la celda creada
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // como PrimerReact no maneja autoFocus nativo, se crea un ref para poder hacer este efecto
  const editorRef = useRef<Record<string, Editor | null>>({})

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
        isEditing: true
      })
    );
    setEditingCellId(id);

    // esperamos un clico poara que el Dom se actualice
    setTimeout(() => {
      const el = cellRefs.current[id]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      const editorInstance = editorRef.current[id]
      if (editorInstance) {
        const editableDiv = editorInstance.getQuill().root
        editableDiv.focus()
      }

    }, 50)
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        setCells((prev) => prev.filter((cell) => cell.id !== id));
        if (editingCellId === id) {
          setEditingCellId(null);
        }

        Swal.fire('Eliminado', 'La línea ha sido eliminada.', 'success');
      }
    });
  };

  const handleSavePages = () => {
    const pages = groupCellsIntoPages(cells);


    console.log("Pages", pages);

    Swal.fire('¡Páginas preparadas!', `Se generaron ${pages.length} páginas.`, 'success');
  };

  return (
    <div className=' bg-gray-100 min-h-screen'>
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
          <button className="bg-gray-700 text-white hover:bg-gray-950 px-4 py-2 rounded-lg">
            Publicar
          </button>
          <button
            className="border border-black text-black px-4 py-2 rounded-lg"
            onClick={handleSavePages}
          >
            Guardar
          </button>
          <button disabled className="border border-black text-black px-4 py-2 rounded-lg ">
            Vista previa
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-col gap-6  w-full">
        <div className='sticky top-[4.7rem] z-50 bg-white pb-4 pt-3 '>
          <Button
            icon="pi pi-plus"
            label="Agregar Celda"
            onClick={addCell}
            className="self-start"
          />
        </div>

        <div className='flex justify-center'>
          <div className='bg-white  shadow-md rounded-lg px-8 py-10 max-w-[800px] w-full'>


            {cells.map((cell) => (
              <div
                key={cell.id}
                ref={(el) => { cellRefs.current[cell.id] = el }}
                className="group flex-row relative flex w-full items-start gap-4 px-6 py-4 border-b"
              >
                {editingCellId === cell.id ? (
                  <>
                    <div className=" w-full">
                      <Editor
                        value={cell.content}
                        onTextChange={(e) => updateContent(cell.id, e.htmlValue!)}
                        ref={(el) => { editorRef.current[cell.id] = el }}
                        style={{ width: '650px', height: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}
                      />
                    </div>
                    {/* <div
                    className="prose max-w-none break-words whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: cell.content }}
                  /> */}
                  </>
                ) : (
                  <>
                    <div
                      className="prose max-w-none break-words whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: cell.content }}
                    />
                    <div className="absolute right-6 top-4 hidden group-hover:flex gap-2">
                      <button
                        onClick={() => setEditingCellId(cell.id)}
                        className="text-sm text-blue-500 hover:cursor-pointer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteCell(cell.id)}
                        className="text-sm text-red-500 hover:cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEditor;
