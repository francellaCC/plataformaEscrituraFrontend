import { useEffect, useRef, useState } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import type { TextCell } from '../types/types';
import { groupCellsIntoPages } from '../utils/paginationUtils';

type FormEditorPageProps = {
  storyTitle?: string;
  initialTitle?: string;
  initialCells?: TextCell[];
  onSubmit: (pages: { pageNumber: number; content: string }[], title: string) => Promise<void>;
};

export default function FormEditorPage({
  storyTitle,
  initialTitle = 'Parte 1',
  initialCells = [],
  onSubmit,
}: FormEditorPageProps) {
  const [cells, setCells] = useState<TextCell[]>(initialCells);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle);

  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const editorRef = useRef<Record<string, Editor | null>>({});

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
    const pages = groupCellsIntoPages(cells);
    await onSubmit(
      pages.map((page) => ({
        pageNumber: page.number,
        content: page.cells.map((c) => c.content).join('\n'),
        id : page.id
      })),
      title
    );

    console.log(pages[0].id)
    Swal.fire('¡Páginas preparadas!', `Se generaron ${pages.length} páginas.`, 'success');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-40">
        <div>
          <label className="text-sm text-gray-500">{storyTitle}</label>
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
      <div className="flex flex-col gap-6 w-full">
        <div className="sticky top-[4.7rem] z-50 bg-white pb-4 pt-3 ">
          <Button
            icon="pi pi-plus"
            label="Agregar Celda"
            onClick={addCell}
            className="self-start"
          />
        </div>

        <div className="flex justify-center">
          <div className="bg-white shadow-md rounded-lg px-8 py-10 max-w-[800px] w-full">
            {cells.map((cell) => (
              <div
                key={cell.id}
                ref={(el) => {
                  cellRefs.current[cell.id] = el;
                }}
                className="group flex-row relative flex w-full items-start gap-4 px-6 py-4 border-b"
              >
                {editingCellId === cell.id ? (
                  <div className="w-full">
                    <Editor
                      value={cell.content}
                      onTextChange={(e) => updateContent(cell.id, e.htmlValue!)}
                      ref={(el) => {
                        editorRef.current[cell.id] = el;
                      }}
                      style={{ width: '650px', height: '200px' }}
                    />
                  </div>
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
}
