import { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useGetStoryByIdQuery } from '../services/storyApi';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useCreateChapterMutation } from '../services/chapterApi';

interface TextCell {
  id: string;
  content: string;
  isEditing: boolean;
}

const MAX_CHARACTERS_PER_PAGE = 1000;

// Función que divide las celdas en páginas según la cantidad de caracteres
function splitCellsIntoPages(cells: TextCell[]): string[] {
  const pages: string[] = [];
  let currentPage = '';

  for (const cell of cells) {
    const text = cell.content.replace(/<[^>]*>?/gm, ''); // eliminar etiquetas HTML para contar texto plano

    if ((currentPage + text).length > MAX_CHARACTERS_PER_PAGE) {
      pages.push(currentPage);
      currentPage = text;
    } else {
      currentPage += text;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

const BookEditor = () => {
  const [cells, setCells] = useState<TextCell[]>([]);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [title, setTitle] = useState('Parte 1');
  const [previewPages, setPreviewPages] = useState<string[]>([]);

  const { idStory } = useParams();
  const storyId = idStory ? parseInt(idStory) : 0;
  const { data: story } = useGetStoryByIdQuery(storyId!);
  const [createChapter] = useCreateChapterMutation()

  useEffect(() => {
  if (!title) return; // Evita enviar si title está vacío

  
  const timeoutId = setTimeout(() => {
    createChapter({
      storyId ,
      data: { title }
    });
    console.log(storyId, title)
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
    const pages = splitCellsIntoPages(cells);
    setPreviewPages(pages);

    // Aquí se enviarían al backend con una mutation
    pages.forEach((content, index) => {
      console.log(`📄 Página ${index + 1}:`, content);
      // createPageMutation({ chapterId, pageNumber: index + 1, content })
    });

    Swal.fire('¡Páginas preparadas!', `Se generaron ${pages.length} páginas.`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
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
          <button className="border border-black text-black px-4 py-2 rounded-lg">
            Vista previa
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-col gap-6 p-6 w-full">
        <Button
          icon="pi pi-plus"
          label="Agregar Celda"
          onClick={addCell}
          className="self-start"
        />

        {cells.map((cell) => (
          <div
            key={cell.id}
            className="group relative flex w-full items-start gap-4 px-6 py-4 border-b"
          >
            {editingCellId === cell.id ? (
              <>
                <div className="w-1/2">
                  <Editor
                    value={cell.content}
                    onTextChange={(e) => updateContent(cell.id, e.htmlValue!)}
                    style={{ height: '200px' }}
                  />
                </div>
                <div
                  className="w-1/2 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: cell.content }}
                />
              </>
            ) : (
              <>
                <div
                  className="w-full prose max-w-none"
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

        {/* Vista previa de páginas */}
        {previewPages.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Vista previa de páginas:</h3>
            {previewPages.map((page, i) => (
              <div
                key={i}
                className="border p-4 mb-4 bg-white shadow rounded-md"
              >
                <p className="font-bold mb-2">Página {i + 1}</p>
                <p className="whitespace-pre-wrap">{page}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookEditor;
