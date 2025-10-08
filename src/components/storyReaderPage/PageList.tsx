import { useEffect, useCallback, useRef } from "react";
import { CellRenderer } from "../CellRenderer";
import type { TextCell } from "../../types/types";

interface PageListProps {
  pages: TextCell[];
  hasMore: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
  storyTitle: string
  chapterTitle: string
}

export default function PageList({ pages, hasMore, isFetching, onLoadMore, chapterTitle, storyTitle }: PageListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastPageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) onLoadMore();
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore, onLoadMore]
  );

  return (
    <div className="flex flex-col gap-10">
      <div>
        
        <h1 className="text-3xl font-bold mb-10 text-center">{storyTitle}</h1>

        <h2 className="text-2xl font-normal mb-5 text-center">{chapterTitle}</h2>

      </div>
      {pages.map((page) => (
        <CellRenderer key={page.id} cell={page} />
      ))}

      <div ref={lastPageRef} className="h-10"></div>
      {isFetching && <p className="text-center mt-4">Cargando más páginas...</p>}
    </div>
  );
}
