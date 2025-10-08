import { Button } from "primereact/button";
import { Editor } from 'primereact/editor';
import type { TextCell } from "../types/types"
import type { RefObject, SetStateAction } from "react";
import { CellRenderer } from "./CellRenderer";


interface EditorProps {
  addCell: () => void,
  cells: TextCell[],
  cellRefs: RefObject<Record<string, HTMLDivElement | null>>
  editingCellId: string | null
  updateContent: (id: string, newContent: string) => void
  editorRef: RefObject<Record<string, Editor | null>>
  setEditingCellId: (value: SetStateAction<string | null>) => void
  deleteCell: (id: string) => void
}

function EditorCell({addCell, cells, cellRefs, editingCellId, updateContent, editorRef, setEditingCellId, deleteCell}:EditorProps) {
  return (
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
                  <CellRenderer cell={cell} />
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
  )
}

export default EditorCell