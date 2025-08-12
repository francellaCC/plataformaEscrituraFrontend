import type { TextCell } from "../types/types";

const MAX_CHARACTERS_PER_PAGE = 100;

interface Page {
  number: number;
  cells: TextCell[];
}

export function groupCellsIntoPages(cells: TextCell[]): Page[] {
  const pages: Page[] = [];
  let currentCells: TextCell[] = [];
  let currentCharCount = 0;
  let pageNumber = 1;

  for (const cell of cells) {
    const plainText = cell.content.replace(/<[^>]*>?/gm, ''); // remove HTML tags
    const cellLength = plainText.length;

    if (currentCharCount + cellLength > MAX_CHARACTERS_PER_PAGE && currentCells.length > 0) {
      pages.push({ number: pageNumber++, cells: currentCells });
      currentCells = [cell];
      currentCharCount = cellLength;
    } else {
      currentCells.push(cell);
      currentCharCount += cellLength;
    }
  }

  if (currentCells.length > 0) {
    pages.push({ number: pageNumber, cells: currentCells });
  }

  return pages;
}
