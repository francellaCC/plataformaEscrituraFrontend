import { useEffect, useState } from "react";
import { useGetImagePresignedQuery } from "../services/s3Api";
import type { TextCell } from "../types/types";

const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;

// detecta si la imagen esta en local (data url o blob)

function isLocalImage(src: string){
  return src.startsWith("data:") || src.startsWith("blob:")
}
export function CellRenderer({ cell }: { cell: TextCell }) {
  const [finalHtml, setFinalHtml] = useState(cell.content);

  const matches = [...cell.content.matchAll(imgRegex)];
  const keys = matches.map((m) => m[1]).filter((src)=>!isLocalImage(src));

  const { data, isSuccess } = useGetImagePresignedQuery(keys, {
    skip: keys.length === 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      let updatedHtml = cell.content;
      data.forEach(({ key, url }) => {
        updatedHtml = updatedHtml.replaceAll(key, url);
      });
      setFinalHtml(updatedHtml);
    }
  }, [isSuccess, data, cell.content]);

  return (
    <div
      className="prose max-w-none break-words whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
}
