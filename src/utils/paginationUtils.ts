import type { TextCell } from "../types/types";

const MAX_CHARACTERS_PER_PAGE = 1000;
const IMAGE_WEIGHT =500;

interface Page {
  number: number;
  cells: TextCell[];
  id?: number; // id de la página del backend
}

export function groupCellsIntoPages(cells: TextCell[]): Page[] {
  const pages: Page[] = [];
  let currentCells: TextCell[] = [];
  let currentCharCount = 0;
  let pageNumber = 1;

  // Mapear pageNumber -> pageId de las celdas existentes
  const pageIdMap = new Map<number, number>();
  cells.forEach(cell => {
    if (cell.pageId !== undefined && cell.pageNumber !== undefined) {
      pageIdMap.set(cell.pageNumber, cell.pageId);
    }
  });

  for (const cell of cells) {
    const plainText = cell.content.replace(/<[^>]*>?/gm, ''); // eliminar HTML tags
  

    //contar imagenes del html
    const imageMatches = cell.content.match(/<img\s+[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
    const imageWeigth = imageMatches.length * IMAGE_WEIGHT;

    const cellLength = plainText.length + imageWeigth;
    if (currentCharCount + cellLength > MAX_CHARACTERS_PER_PAGE && currentCells.length > 0) {
      // crear página
      pages.push({
        number: pageNumber,
        cells: currentCells,
        id: pageIdMap.get(pageNumber), // mantener el id si existía
      });

      currentCells = [cell];
      currentCharCount = cellLength;
      pageNumber++;
    } else {
      currentCells.push(cell);
      currentCharCount += cellLength;
    }
  }

  // última página
  if (currentCells.length > 0) {
    pages.push({
      number: pageNumber,
      cells: currentCells,
      id: pageIdMap.get(pageNumber),
    });
  }

  return pages;
}
