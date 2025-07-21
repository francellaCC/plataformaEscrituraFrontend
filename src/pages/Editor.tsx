import { useState } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Swal from 'sweetalert2';

interface TextCell {
  id: string;
  content: string;
  isEditing: boolean;
}

const BookEditor = () => {
  const [cells, setCells] = useState<TextCell[]>([]);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);


  const [title, setTitle] = useState('Nombre del documento');


  const addCell = () => {

    const id = crypto.randomUUID()
    setCells((prev) =>
      prev.map((cell) => ({ ...cell, isEditing: false })).concat({
        id,
        content: '',
        isEditing: true
      })
    );
    setEditingCellId(id)
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
      title: "Estas seguro?",
      text: "No podras revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar!",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        setCells((prev) => prev.filter((cell) => cell.id !== id));

        // Si eliminamos la celda que estaba en edición, limpiamos el estado
        if (editingCellId === id) {
          setEditingCellId(null);
        }

        Swal.fire({
          title: "Eliminado!",
          text: "Tu linea a sido eliminada correctamente.",
          icon: "success"
        });
      }
    });

  };

  return (
    <div>

      <div className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
        <div>
          <label className='text-sm ' htmlFor="">Dios de las tinieblas</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold w-full outline-none bg-transparent"
            placeholder="Nombre del documento"
          />
        </div>
        <div className="flex items-center gap-4">
          <button  className="bg-gray-700 text-white hover:bg-gray-950 px-4 py-2  rounded-lg">
           Publicar
          </button>
          <button className=" border border-black text-black px-4 py-2  rounded-lg">
            Guardar
          </button>
           <button className=" border border-black text-black px-4 py-2  rounded-lg">
            Vista previa
          </button>
        </div>
      </div>
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
                {editingCellId !== cell.id && (
                  <div className="absolute right-6 top-4 hidden group-hover:flex gap-2">
                    <button
                      onClick={() => setEditingCellId(cell.id)}
                      className=" text-sm text-blue-500 hover:cursor-pointer"
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteCell(cell.id)} className='text-sm text-blue-500 hover:cursor-pointer'>🗑️</button>
                  </div>

                )}
              </>
            )}
          </div>
        ))}



      </div>
    </div>

  );
};

export default BookEditor;
