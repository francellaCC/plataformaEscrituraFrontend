// ya lo tienes implementado para renderizar celdas

import { CellRenderer } from "../../components/CellRenderer";
import type { TextCell } from "../../types/types";

interface StoryPreviewProps {

  cells: TextCell[]; // aquí puedes tipar con tu interfaz de celda si ya la tienes
}

export default function StoryPreview({cells }: StoryPreviewProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
     

      {/* Renderizado en cascada de las celdas */}
      <div className="space-y-4">
        {cells.map((cell) => (
          <div key={cell.id} className="border-b pb-4">
            <CellRenderer cell={cell} />
          </div>
        ))}
      </div>
    </div>
  );
}
