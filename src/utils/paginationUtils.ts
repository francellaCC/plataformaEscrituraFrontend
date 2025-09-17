import type { TextCell } from "../types/types";
import { uploadImageToS3 } from "./uploadImageToS3";

const MAX_CHARACTERS_PER_PAGE = 1000;
const IMAGE_WEIGHT = 200;

interface Page {
  number: number;
  cells: TextCell[];
  id?: number;       // id de la página en BD
  hasImage: boolean;
}

// 🔹 Regex para detectar <img src="...">
function extractImageSources(content: string): string[] {
  const regex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}



export async function groupCellsIntoPages(
  cells: TextCell[],
  getPresignedUrl: (args: { filename: string; contentType: string }) => Promise<{ uploadUrl: string }>
): Promise<Page[]> {
  const pages: Page[] = [];
  let currentCells: TextCell[] = [];
  let currentCharCount = 0;
  let pageNumber = 1;

  // 🔹 Guardamos relación cell.id -> pageId para preservar lo que viene de BD
  const cellPageIdMap = new Map<string, number>();
  cells.forEach(cell => {
    if (cell.id && cell.pageId !== undefined) {
      cellPageIdMap.set(cell.id, cell.pageId);
    }
  });

  const processedCells: TextCell[] = [];

  for (const cell of cells) {
    let content = cell.content;
    const imageSources = extractImageSources(content);

    for (const src of imageSources) {
      if (src.startsWith("data:image")) {
        const blob = await (await fetch(src)).blob();
        const key = `cell-${cell.id ?? crypto.randomUUID()}-${Date.now()}.png`;
        const file = new File([blob], key, { type: blob.type });

        const uploadedKey = await uploadImageToS3(file, key, getPresignedUrl);
        console.log(uploadedKey)

        // 🔹 Reemplazamos src con el key (no con URL pública)
        const s3Key = `pages/${uploadedKey}`
        content = content.replace(src, s3Key);
      }
    }

    processedCells.push({
      ...cell,
      content,
      pageNumber: undefined, // se recalcula
      pageId: cellPageIdMap.get(cell.id!), // mantenemos el id de BD si existe
    });
  }

  // 🔹 Segunda pasada: agrupación en páginas
  for (const cell of processedCells) {
    const plainText = cell.content.replace(/<[^>]*>?/gm, "");
    const textLength = plainText.length;
    const hasImage = extractImageSources(cell.content).length > 0;
    const imagePenalty = hasImage ? IMAGE_WEIGHT : 0;
    const cellLength = textLength + imagePenalty;

    if (currentCharCount + cellLength > MAX_CHARACTERS_PER_PAGE && currentCells.length > 0) {
      const existingPageId = findMostCommonPageId(currentCells);

      pages.push({
        number: pageNumber,
        cells: currentCells.map(c => ({ ...c, pageNumber })),
        id: existingPageId,
        hasImage: currentCells.some(c => extractImageSources(c.content).length > 0),
      });

      currentCells = [cell];
      currentCharCount = cellLength;
      pageNumber++;
    } else {
      currentCells.push(cell);
      currentCharCount += cellLength;
    }
  }

  if (currentCells.length > 0) {
    const existingPageId = findMostCommonPageId(currentCells);

    pages.push({
      number: pageNumber,
      cells: currentCells.map(c => ({ ...c, pageNumber })),
      id: existingPageId,
      hasImage: currentCells.some(c => extractImageSources(c.content).length > 0),
    });
  }

  return pages;
}

// 🔹 Mantener los pageId de BD cuando sea posible
function findMostCommonPageId(cells: TextCell[]): number | undefined {
  const pageIdCounts = new Map<number, number>();

  cells.forEach(cell => {
    if (cell.pageId !== undefined) {
      pageIdCounts.set(cell.pageId, (pageIdCounts.get(cell.pageId) || 0) + 1);
    }
  });

  let mostCommonPageId: number | undefined;
  let maxCount = 0;

  pageIdCounts.forEach((count, pageId) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonPageId = pageId;
    }
  });

  return mostCommonPageId;
}
